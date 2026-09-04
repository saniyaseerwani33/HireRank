function HowItWorks() {
  return (
    <section className="homepage-how">

      <div className="homepage-how-header">
        <h2>How HireRank Works</h2>
        <p>
          A simple AI-powered recruitment process for both students and recruiters.
        </p>
      </div>

      <div className="homepage-how-grid">

        <div className="homepage-step-card">
          <div className="step-number">1</div>
          <h3>Create Your Profile</h3>
          <p>
            Students register, build their profile, and upload their resumes.
          </p>
        </div>

        <div className="homepage-step-card">
          <div className="step-number">2</div>
          <h3>Apply for Jobs</h3>
          <p>
            Browse available jobs and apply to opportunities that match your skills.
          </p>
        </div>

        <div className="homepage-step-card">
          <div className="step-number">3</div>
          <h3>AI Resume Analysis</h3>
          <p>
            HireRank analyzes resumes, calculates ATS scores, and ranks candidates automatically.
          </p>
        </div>

        <div className="homepage-step-card">
          <div className="step-number">4</div>
          <h3>Recruiter Shortlists</h3>
          <p>
            Recruiters review AI reports, compare candidates, and hire the best talent.
          </p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;