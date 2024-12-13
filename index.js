const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // Define the app before using middleware

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

const PORT = 3001;

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/todoapp")
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const Task = mongoose.model("Task", taskSchema);

// Endpoints

// GET /tasks - Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const { completed } = req.query;
    const query = completed
      ? { status: completed === "true" ? "completed" : "pending" }
      : {};
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching tasks." });
  }
});

// POST /tasks - Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { description, category } = req.body;
    const newTask = new Task({ description, category });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(400)
      .json({ message: "An error occurred while creating the task." });
  }
});

// DELETE /tasks/:task_id - Delete a task
app.delete("/tasks/:task_id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.task_id);
    if (task) res.json({ message: "Task deleted successfully." });
    else res.status(404).json({ error: "Task not found." });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format." });
  }
});

// GET /tasks/:task_id - Fetch a task by ID
app.get("/tasks/:task_id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.task_id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format." });
  }
});

// PUT /tasks/:task_id - Update a task
app.put("/tasks/:task_id", async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.task_id, updates, {
      new: true,
    });
    if (task) res.json(task);
    else res.status(404).json({ error: "Task not found." });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format." });
  }
});

// PUT /tasks/:task_id/complete - Mark task as completed
app.put("/tasks/:task_id/complete", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.task_id,
      { status: "completed" },
      { new: true }
    );
    if (task) res.json(task);
    else res.status(404).json({ error: "Task not found." });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
