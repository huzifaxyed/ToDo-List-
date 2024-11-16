const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

let data = []; 

// Read - Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(data);
});

// Create - Add new task
app.post("/api/tasks/add", (req, res) => {
  const task = req.body.task;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const newTask = {
    id: Date.now(),
    task,
  };
  data.push(newTask);
  res.status(201).json(newTask); 
});

// Update - Edit task
app.put("/api/tasks/update/:id", (req, res) => {
  const id = Number(req.params.id);
  const { task } = req.body;

  const index = data.findIndex((item) => item.id === id);

  if (index >= 0) {
    data[index].task = task; 
    res.json(data[index]); 
  } else {
    res.status(404).json({ error: "Task Not Found" });
  }
});

// Delete - Remove task
app.delete("/api/tasks/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = data.findIndex((item) => item.id === id);

  if (index >= 0) {
    const deletedTask = data.splice(index, 1); 
    res.json(deletedTask); 
  } else {
    res.status(404).json({ error: "Task Not Found" });
  }
});

// Server Configuration...
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});