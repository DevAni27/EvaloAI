import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { listAssignments, createAssignment } from "./api";

function Home() {
  const [status, setStatus] = useState("Checking API…");
  useEffect(() => {
    (async () => {
      try {
        await listAssignments();
        setStatus("API connected ✅");
      } catch (e) {
        setStatus(`API error: ${e.message}`);
      }
    })();
  }, []);
  return <p>{status}</p>;
}

function Assignments() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", prompt: "", sampleAnswer: "" });
  const [saving, setSaving] = useState(false);
  const load = async () => setItems(await listAssignments());

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAssignment(form);
      setForm({ title: "", prompt: "", sampleAnswer: "" });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Assignments</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Prompt"
          value={form.prompt}
          onChange={(e) => setForm({ ...form, prompt: e.target.value })}
          required
          rows={4}
        />
        <textarea
          placeholder="Sample Answer (optional)"
          value={form.sampleAnswer}
          onChange={(e) => setForm({ ...form, sampleAnswer: e.target.value })}
          rows={3}
        />
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Create assignment"}</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {items.map(a => (
          <li key={a.id}>
            <strong>{a.title}</strong> — {new Date(a.createdAt).toLocaleString()}
          </li>
        ))}
        {items.length === 0 && <li>No assignments yet.</li>}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1>AI Auto Grader</h1>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/assignments">Assignments</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignments" element={<Assignments />} />
      </Routes>
    </div>
  );
}
