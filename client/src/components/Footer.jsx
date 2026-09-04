import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="homepage-footer">
      <div className="homepage-footer-container">

        <h3>HireRank</h3>

        <p className="footer-tagline">
          AI-Powered Campus Recruitment Platform
        </p>

        <div className="footer-links">
          <Link
  to="/"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  Home
</Link>
          <Link to="/student-login">Student Login</Link>
          <Link to="/recruiter-login">Recruiter Login</Link>
          <Link to="/student-register">Student Register</Link>
          <Link to="/recruiter-register">Recruiter Register</Link>
        </div>

        <p className="footer-copyright">
          © 2026 HireRank • Developed by Saniya Seerwani
        </p>

      </div>
    </footer>
  );
}

export default Footer;