class Task {
  constructor(id, title, priority = "medium") {
    this.id = id;
    this.title = title;
    this.priority = priority; // 'low' | 'medium' | 'high'
    this.completed = false;
    this.createdAt = new Date();
  }
}

class TaskManager {
  constructor() {
    this.tasks = new Map();
    this.nextId = 1;
  }

  // Create
  addTask(title, priority) {
    if (!title?.trim()) throw new Error("Task title is required.");
    const task = new Task(this.nextId++, title.trim(), priority);
    this.tasks.set(task.id, task);
    return task;
  }

  // Read
  getTask(id) {
    return this.tasks.get(id) || null;
  }

  listTasks({ status = "all", priority } = {}) {
    return Array.from(this.tasks.values()).filter((task) => {
      const statusMatch =
        status === "all" ||
        (status === "completed" && task.completed) ||
        (status === "pending" && !task.completed);

      const priorityMatch = !priority || task.priority === priority;

      return statusMatch && priorityMatch;
    });
  }

  // Update
  toggleComplete(id) {
    const task = this.getTask(id);
    if (!task) return false;
    task.completed = !task.completed;
    return task;
  }

  updateTask(id, updates) {
    const task = this.getTask(id);
    if (!task) return false;
    
    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.priority !== undefined) task.priority = updates.priority;
    return task;
  }

  // Delete
  deleteTask(id) {
    return this.tasks.delete(id);
  }
}

// Example Usage:
const manager = new TaskManager();

manager.addTask("Buy groceries", "high");
manager.addTask("Clean the garage", "low");
manager.addTask("Write documentation", "medium");

manager.toggleComplete(1); // Mark "Buy groceries" complete

console.log("Pending Tasks:", manager.listTasks({ status: "pending" }));
console.log("High Priority Tasks:", manager.listTasks({ priority: "high" }));


const express = require('express');
const app = express();
app.use(express.json());

let items = [];
let nextId = 1;

app.post('/items', (req, res) => {
  const item = { id: nextId++, ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.get('/items', (req, res) => res.json(items));

app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === +req.params.id);
  item ? res.json(item) : res.status(404).end();
});

app.put('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === +req.params.id);
  if (index === -1) return res.status(404).end();
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === +req.params.id);
  if (index === -1) return res.status(404).end();
  items.splice(index, 1);
  res.status(204).end();
});

app.listen(3000);
const express = require('express');
const router = express.Router();

// In-memory example — swap this out for your actual DB calls
let items = [
  { id: 1, name: 'Item A', category: 'x' },
  { id: 2, name: 'Item B', category: 'y' },
];

// SELECT (GET) — supports optional filtering via query params
// e.g. GET /items?category=x
router.get('/items', (req, res) => {
  const { category } = req.query;
  let result = items;

  if (category) {
    result = result.filter(item => item.category === category);
  }

  res.json(result);
});

// SELECT ONE (GET by id)
router.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// REMOVE (DELETE)
router.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const [deleted] = items.splice(index, 1);
  res.json({ message: 'Item removed', deleted });
});

module.exports = router;
