const express = require("express");
const jwt = require("jsonwebtoken");
const { findById, findByIdAndUpdate } = require("./models/task");
const app = express();

const multer = require("multer");
const upload = multer({
  dest: "images",
});

app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});

const userRouter = require("./routers/user_route");
const taskRouter = require("./routers/task_route");
const task = require("./models/task.js");
const user = require("./models/user.js");
require("./db/mongoose");

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
const bcrypt = require("bcrypt");

const port = process.env.PORT;
app.listen(port, () => console.log(`started on port ${port}`));
