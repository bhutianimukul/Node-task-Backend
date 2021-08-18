const mongoose = require("mongoose");
const validator = require("validator");
const TaskSchema = mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
