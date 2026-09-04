import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { Link } from "react-router-dom";

function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [rememberMe, setRememberMe] = useState(false);

const navigate = useNavigate();
useEffect(() => {
  const student = JSON.parse(
    localStorage.getItem("student") ||
    sessionStorage.getItem("student")
  );

  if (student) {
    navigate("/student-dashboard");
  }
}, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);

    const response = await API.post("/students/login", {
      email,
      password,
    });

    toast.success(response.data.message);

    const storage = rememberMe ? localStorage : sessionStorage;

// Clear old login data
localStorage.removeItem("student");
sessionStorage.removeItem("student");

// Save in the selected storage
storage.setItem(
  "student",
  JSON.stringify(response.data.student)
);

    navigate("/student-dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Student Login</h2>
        <p>Welcome back! Login to continue.</p>

        <form onSubmit={handleSubmit}>
  <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

  <div className="password-box">
    <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

    <button
      type="button"
      className="toggle-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  <div className="login-options">
    <label>
  <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
  Remember Me
</label>

    <Link to="/forgot-password">
  Forgot Password?
</Link>
  </div>

  <button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>
</form>

        <p className="signup-text">
          Don't have an account? <Link to="/student-register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;