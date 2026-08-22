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
