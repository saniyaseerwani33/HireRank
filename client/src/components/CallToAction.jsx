import { useNavigate } from "react-router-dom";

function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="homepage-cta">

      <h2>Ready to Build Your Career?</h2>

      <p>
        Whether you're a student looking for opportunities or a recruiter
        searching for top talent, HireRank is here to simplify the hiring
        process with AI.
      </p>

      <div className="homepage-cta-buttons">
        <button onClick={() => navigate("/student-register")}>
          Get Started
        </button>

        <button
          className="homepage-secondary-btn"
          onClick={() => navigate("/student-login")}
        >
          Login
        </button>
      </div>

    </section>
  );
}

export default CallToAction;