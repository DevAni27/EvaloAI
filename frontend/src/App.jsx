import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";

export default function App() {
  const { user, role } = useAuth();
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1>EvaloAI</h1>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {!user && (<>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>)}
        {user && role === "student" && <Link to="/student">Student</Link>}
        {user && role === "teacher" && <Link to="/teacher">Teacher</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<div>Welcome to AI Auto Grader</div>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
