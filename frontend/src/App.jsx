import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking API…");

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    fetch(`${base}/api/health`)
      .then(r => r.json())
      .then(d => setStatus(d.ok ? "API connected ✅" : "API error"))
      .catch(e => setStatus(`API error: ${e.message}`));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1>EvaloAI</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
