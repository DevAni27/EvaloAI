// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/** In-memory stores (temporary, replaced by Supabase later) */
const assignments = [];
const submissions = [];

/** Health */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "backend", ts: new Date().toISOString() });
});

/** Assignments */
app.get("/api/assignments", (_req, res) => {
  res.json(assignments);
});

app.post("/api/assignments", (req, res, next) => {
  try {
    const { title, prompt, sampleAnswer, dueAt, createdBy } = req.body;
    if (!title || !prompt) {
      return res.status(400).json({ error: "title and prompt are required" });
    }
    const id = (global.crypto?.randomUUID?.() || require("crypto").randomUUID()).toString();
    const item = {
      id,
      title,
      prompt,
      sampleAnswer: sampleAnswer ?? "",
      dueAt: dueAt ?? null,
      createdBy: createdBy ?? "teacher_demo",
      createdAt: new Date().toISOString(),
    };
    assignments.push(item);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

app.get("/api/assignments/:id", (req, res) => {
  const a = assignments.find(x => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: "assignment not found" });
  res.json(a);
});

/** Submissions */
app.post("/api/submissions", (req, res, next) => {
  try {
    const { assignmentId, studentId, content } = req.body;
    if (!assignmentId || !studentId || !content) {
      return res.status(400).json({ error: "assignmentId, studentId, content required" });
    }
    const exists = assignments.some(a => a.id === assignmentId);
    if (!exists) return res.status(400).json({ error: "invalid assignmentId" });

    const id = (global.crypto?.randomUUID?.() || require("crypto").randomUUID()).toString();
    const item = {
      id,
      assignmentId,
      studentId,
      content,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(item);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

app.get("/api/submissions", (req, res) => {
  const { assignmentId } = req.query;
  const list = assignmentId ? submissions.filter(s => s.assignmentId === assignmentId) : submissions;
  res.json(list);
});

/** 404 + error handler */
app.use((_req, res) => res.status(404).json({ error: "not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
