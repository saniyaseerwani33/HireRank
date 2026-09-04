import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/students/forgot-password", {
        email,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="signup-text">
          <Link to="/student-login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;