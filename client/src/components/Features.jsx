function Features() {
  return (
    <section className="homepage-features">

      <div className="homepage-features-header">
        <h2>Why Choose HireRank?</h2>
        <p>
          Everything you need for smarter campus recruitment,
          powered by AI and designed for both students and recruiters.
        </p>
      </div>

      <div className="homepage-features-grid">

        <div className="homepage-feature-card">
          <div className="feature-icon">🎓</div>
          <h3>Student Profiles</h3>
          <p>
            Build professional profiles with education, skills,
            projects, certifications and resumes.
          </p>
        </div>

        <div className="homepage-feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Resume Analysis</h3>
          <p>
            Automatically analyze resumes, calculate ATS scores,
            and rank candidates based on job requirements.
          </p>
        </div>

        <div className="homepage-feature-card">
          <div className="feature-icon">💼</div>
          <h3>Job Management</h3>
          <p>
            Recruiters can post jobs, manage applications,
            shortlist candidates and update application status.
          </p>
        </div>

        <div className="homepage-feature-card">
          <div className="feature-icon">📊</div>
          <h3>Recruiter Dashboard</h3>
          <p>
            View applications, compare candidates,
            access AI reports and hire the best talent quickly.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;