const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (validator.isEmail(val) == false) throw new Error("Invalid Email");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    age: {
      type: Number,
      required: true,
      validate(val) {
        if (val < 0) throw new Error("Age can be positive only");
      },
    },
    avatar: {
      type: Buffer,
    },
    password: {
      type: String,
      minlength: 7,
      required: true,
      trim: true,
      validate(val) {
        if (val.toLowerCase().includes("password"))
          throw new Error("Invalid password");
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
  /// just like join
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
//! delete user tasks when use deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// instance methods accesed by object of model only
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.jwt_secret);
  user.tokens = user.tokens.concat({ token });

  await user.save();
  // console.log(user);
  return token;
};
//? Overiding to JSON
userSchema.methods.toJSON = function () {
  const user = this;

  var userObject = user.toObject();
  userObject = {
    name: userObject.name,
    age: userObject.age,
    email: userObject.email,
  };
  //console.log(userObject);
  return userObject;
};
// Model methods accesed by model as static method
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("No user find");

  const result = await bcrypt.compare(password, user.password);
  if (result === false) throw new Error("Unable to login");
  return user;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
