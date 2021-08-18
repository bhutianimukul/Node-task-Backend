const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth_middle = require("../middleware/auth");
const { query } = require("express");
//!create a task
router.post("/tasks", auth_middle, async (req, res) => {
  const task = new Task(req.body);
  task.owner = req.user._id;
  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

//!get all tasks
router.get("/tasks", auth_middle, async (req, res) => {
  try {
    const match = {};
    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy.split(":")[0]] =
        req.query.sortBy.split(":")[1] === "desc" ? -1 : 1;
    }
    console.log(sort);
    //console.log(req.query);
    if (req.query.completed == "true") match.completed = true;
    else if (req.query.completed == "false") match.completed = false;

    //! const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});
//! reading task by id
router.get("/tasks/:id", auth_middle, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    //   const task = await Task.findById(req.user._id);

    if (!task) res.status(400).send("no such task  found");
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
//!update task by id

router.patch("/tasks/:id", auth_middle, async (req, res) => {
  try {
    const allowed_update = ["description", "completed"];
    const updates = Object.keys(req.body);

    updates.forEach((change) => {
      if (allowed_update.includes(change) == false) {
        throw new Error("inValid params");
      }
    });
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) res.status(404).send("not find");
    updates.forEach((update) => {
      console.log(task[update]);
      task[update] = req.body[update];
    });
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidator: true,
    // });
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(500).send("Unable to update");
  }
});

//! delete tasks
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) res.status(404).send("Task not found");
    res.send(task);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to delete");
  }
});
module.exports = router;
