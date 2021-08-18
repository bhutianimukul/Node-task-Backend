const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  //console.log("auth middleware");
  try {
    const token = req.header("auth").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.jwt_secret);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    console.log(user);
    // console.log(user);

    if (!user) throw new Error();

    req.user = user;

    req.token = token;
    next();

    //! checking whether provided auth token is still valid or not int db or not
    // user.tokens.forEach((obj) => {
    //   if (obj.token === token) {
    //     console.log("user found");
    //     console.log(user);
    //     next();
    //   }
    // });
  } catch (err) {
    res.status(401).send("Not Authenticated");
  }
};
module.exports = auth;
