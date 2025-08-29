// StudentDashboard.jsx
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2>Student Dashboard</h2>
      <p>Signed in as: {user?.email}</p>
      <button onClick={async () => { await supabase.auth.signOut(); nav("/login"); }}>
        Sign out
      </button>
    </div>
  );
}
