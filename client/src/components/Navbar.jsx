import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="homepage-navbar">

      <h2 className="homepage-logo">HireRank</h2>

      <ul className="homepage-nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/student-login">Student Login</Link>
        </li>

        <li>
          <Link to="/recruiter-login">Recruiter Login</Link>
        </li>
      </ul>

    </nav>
  );
}

export default Navbar;