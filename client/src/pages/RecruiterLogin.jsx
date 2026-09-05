import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { Link } from "react-router-dom";

function RecruiterLogin() {
  const navigate = useNavigate();
  useEffect(() => {
  const recruiter = JSON.parse(
    localStorage.getItem("recruiter") ||
    sessionStorage.getItem("recruiter")
  );

  if (recruiter) {
    navigate("/recruiter-dashboard");
  }
}, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [rememberMe, setRememberMe] = useState(false);
const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);

    const response = await API.post("/recruiters/login", {
      email,
      password,
    });

    toast.success(response.data.message);

    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.removeItem("recruiter");
    sessionStorage.removeItem("recruiter");

    storage.setItem(
      "recruiter",
      JSON.stringify(response.data.recruiter)
    );

    navigate("/recruiter-dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Recruiter Login</h2>
        <p>Welcome back! Login to hire top talent.</p>

        <form onSubmit={handleSubmit}>
          <input
  type="email"
  placeholder="Enter your company email"
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

            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>
        </form>

        <p className="signup-text">
          Don't have a recruiter account? <Link to="/recruiter-register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default RecruiterLogin;