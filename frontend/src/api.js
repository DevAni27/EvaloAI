const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function listAssignments() {
  const res = await fetch(`${BASE}/api/assignments`);
  if (!res.ok) throw new Error("Failed to load assignments");
  return res.json();
}

export async function createAssignment(payload) {
  const res = await fetch(`${BASE}/api/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Create failed");
  return res.json();
}
