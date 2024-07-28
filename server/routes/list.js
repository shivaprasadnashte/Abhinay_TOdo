const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");

// Create a task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id } = req.body;
    const existingUser = await User.findById(id);
    if (existingUser) {
      let list = new List({ title, body, user: existingUser._id });
      await list.save();

      existingUser.list.push(list);
      await existingUser.save();

      res.status(200).json({ list });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true, runValidators: true }
    );

    if (list) {
      res.status(200).json({ message: "Task Updated", list });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const existingUser = await User.findByIdAndUpdate(userId, {
      $pull: { list: req.params.id },
    });

    if (existingUser) {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task Deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get tasks for a user
router.get("/getTasks/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    if (list.length !== 0) {
      res.status(200).json({ list });
    } else {
      res.status(404).json({ message: "No tasks found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
