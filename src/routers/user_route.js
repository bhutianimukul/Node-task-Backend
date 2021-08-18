const express = require("express");
const router = new express.Router();
const auth_middle = require("../middleware/auth");
const sharp = require("sharp");
const multer = require("multer");
const mail = require("../emails/account");
const uploads = multer({
  //dest: "avatars",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.jpg|\.png|\.jpeg|\.JPG|\.PNG|\.JPEG$/))
      cb(new Error("Invalid file type"));
    else cb(undefined, true);
  },
  limits: {
    fileSize: 4000000,
  },
});

//!create a user
const User = require("../models/user");
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    mail.welcomeMail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.send({ user: user, token });
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

//!signin
router.post("/users/login", async (req, res) => {
  // console.log("hello");
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    //console.log(user);
    const token = await user.generateAuthToken();
    // const newUser = user.getPublicProfile();
    //  console.log(user);
    res.send({ user, token });
  } catch (er) {
    console.log(er);
    res.status(500).send("Error");
  }
});
//! Signout
router.post("/tasks/logout", auth_middle, async (req, res) => {
  try {
    const token = req.token;

    req.user.tokens = req.user.tokens.filter((t) => {
      if (token === t.token) return false;
      return true;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send(" Error in logout");
  }
});
//!signout all
router.post("/users/logoutAll", auth_middle, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send("Error while logging out");
  }
});
//!update user
router.patch("/users/me", auth_middle, async (req, res) => {
  try {
    const allowed_update = ["name", "age", "email", "password"];
    const updates = Object.keys(req.body);

    updates.forEach((change) => {
      if (allowed_update.includes(change) == false) {
        throw new Error("inValid params");
      }
    });
    updates.forEach((update) => {
      console.log(update);
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send("Unable to update");
  }
});

//!delete user by id
router.delete("/users/me", auth_middle, async (req, res) => {
  try {
    await req.user.remove();
    mail.confirmDeletion(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send("unable to delete");
  }
});

//! post profile picture

router.post(
  "/users/me/avatar",
  auth_middle,
  uploads.single("avatar"),
  async (req, res) => {
    try {
      // const image = req.file.buffer;
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      const image = buffer;
      req.user.avatar = image;

      await req.user.save();
      res.send("uploaded successfully");
    } catch (e) {
      res.status(401).send(e.message);
    }
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);
//! delete avatar picture
router.delete(
  "/users/me/avatar",
  auth_middle,
  uploads.single("avatar"),
  async (req, res) => {
    try {
      //      const image = req.file.buffer;
      req.user.avatar = undefined;

      await req.user.save();
      res.send("updated successfully");
    } catch (e) {
      res.status(401).send(e.message);
    }
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);
//! reading profile
router.get("/users/me", auth_middle, async (req, res) => {
  res.send(req.user);
});

//! get profile picture by id
router.get("/users/:id/userImage", async (req, res) => {
  try {
    const _id = req.params.id;

    const user = await User.findById(_id);
    console.log(user);
    if (!user || !user.avatar) throw new Error();

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
