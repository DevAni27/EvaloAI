import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const { email, password, role } = form;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }, // store role in user_metadata
    });

    if (error) return setMsg(error.message);
    // If email confirmation is ON, user must confirm via email before a session exists
    setMsg("Sign-up successful! Check your email to confirm your account.");
    // If email confirmation is OFF, you can redirect directly:
    // nav(role === "teacher" ? "/teacher" : "/student", { replace: true });
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Create an account</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Role:
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Sign up</button>
      </form>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
      <p style={{ marginTop: 8 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
