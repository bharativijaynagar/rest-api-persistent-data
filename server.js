const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(path.join(__dirname, "tasks.db"));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const listTasks = db.prepare("SELECT * FROM tasks ORDER BY id DESC");
const findTask = db.prepare("SELECT * FROM tasks WHERE id = ?");
const createTask = db.prepare(
  "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)"
);
const updateTask = db.prepare(
  "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?"
);
const deleteTask = db.prepare("DELETE FROM tasks WHERE id = ?");

function formatTask(task) {
  return task ? { ...task, completed: Boolean(task.completed) } : null;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Task API is running" });
});

app.get("/api/tasks", (_req, res) => {
  res.json(listTasks.all().map(formatTask));
});

app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Task ID must be a positive integer." });
  }
  const task = formatTask(findTask.get(id));
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json(task);
});

app.post("/api/tasks", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body.description === "string" ? req.body.description.trim() : "";
  const completed = req.body.completed === true;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (title.length > 120) {
    return res.status(400).json({ error: "Title must be 120 characters or fewer." });
  }

  const result = createTask.run(title, description, completed ? 1 : 0);
  const task = formatTask(findTask.get(result.lastInsertRowid));
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Task ID must be a positive integer." });
  }
  if (!findTask.get(id)) return res.status(404).json({ error: "Task not found." });

  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body.description === "string" ? req.body.description.trim() : "";
  const completed = req.body.completed === true;

  if (!title) return res.status(400).json({ error: "Title is required." });
  if (title.length > 120) {
    return res.status(400).json({ error: "Title must be 120 characters or fewer." });
  }

  updateTask.run(title, description, completed ? 1 : 0, id);
  res.json(formatTask(findTask.get(id)));
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Task ID must be a positive integer." });
  }
  const existing = findTask.get(id);
  if (!existing) return res.status(404).json({ error: "Task not found." });

  const title = req.body.title === undefined ? existing.title :
    (typeof req.body.title === "string" ? req.body.title.trim() : "");
  const description = req.body.description === undefined ? existing.description :
    (typeof req.body.description === "string" ? req.body.description.trim() : "");
  const completed = req.body.completed === undefined ? Boolean(existing.completed) :
    req.body.completed === true;

  if (!title) return res.status(400).json({ error: "Title is required." });
  if (title.length > 120) {
    return res.status(400).json({ error: "Title must be 120 characters or fewer." });
  }

  updateTask.run(title, description, completed ? 1 : 0, id);
  res.json(formatTask(findTask.get(id)));
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Task ID must be a positive integer." });
  }
  const result = deleteTask.run(id);
  if (!result.changes) return res.status(404).json({ error: "Task not found." });
  res.status(204).send();
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});
