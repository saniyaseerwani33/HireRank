import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    document
      .querySelector(".homepage-features")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="homepage-hero">
      <div className="homepage-hero-content">

        <span className="homepage-badge">
          🚀 AI-Powered Recruitment Platform
        </span>

        <h1>
          Hire Smarter. <span>Hire Faster.</span>
        </h1>

        <p>
          HireRank is an AI-powered campus recruitment platform that helps
          recruiters identify top talent using ATS scoring and AI analysis,
          while enabling students to discover and apply for the right career
          opportunities.
        </p>

        <div className="homepage-hero-buttons">
          <button onClick={() => navigate("/student-register")}>
            Get Started
          </button>

          <button
            className="homepage-secondary-btn"
            onClick={handleLearnMore}
          >
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;