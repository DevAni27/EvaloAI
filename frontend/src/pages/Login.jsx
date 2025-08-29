import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const { email, password } = form;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);

    const role = data.user?.user_metadata?.role;
    nav(role === "teacher" ? "/teacher" : "/student", { replace: true });
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Log in</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Log in</button>
      </form>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
      <p style={{ marginTop: 8 }}>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
