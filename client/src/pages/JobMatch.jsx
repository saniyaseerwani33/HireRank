import { useLocation, useNavigate } from "react-router-dom";
import "../styles/JobMatch.css";

function JobMatch() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const analysis = state?.analysis;
  const job = state?.job;

  if (!analysis || !job) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No job match data found.</h2>
        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const resumeSkills = analysis?.technicalSkills || [];

const jobSkills = (job.requiredSkills || []).map((skill) =>
  skill.toLowerCase()
);

const matchedSkills = resumeSkills.filter((skill) =>
  jobSkills.includes(skill.toLowerCase())
);

const missingSkills = job.requiredSkills.filter(
  (skill) => !matchedSkills.includes(skill)
);

const score =
  job.requiredSkills.length > 0
    ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
    : 0;

    console.log("Resume Skills:", resumeSkills);
console.log("Job Description:", job.description);
console.log("Job Skills:", jobSkills);
console.log("Matched Skills:", matchedSkills);

  return (
  <div className="job-match-page">
    <div className="job-match-wrapper">

      <div className="job-match-actions">
        <button
          className="job-match-back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="job-match-container">

        <div className="job-match-header">
          <h1>🤖 AI Job Match</h1>
        </div>

      <div className="job-match-card">
        <h2>Job Details</h2>

        <p><strong>Position:</strong> {job.jobTitle}</p>
        <p><strong>Company:</strong> {job.companyName}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p>{job.description}</p>
      </div>

<div className="job-match-card">
      <h4>Required Skills</h4>

<div>
  {job.requiredSkills.map((skill) => (
    <span key={skill} className="job-skill-chip">
      {skill}
    </span>
  ))}
</div>
</div>

      <div className="job-match-card">
        <h2>Your Resume Skills</h2>

        {analysis.technicalSkills.map((skill) => (
          <span key={skill} className="job-skill-chip">
            {skill}
          </span>
        ))}
      </div>

      <div className="job-match-card">
        <h2>AI Match Result</h2>

        <h3
  style={{
    color:
      score >= 80
        ? "#16a34a"
        : score >= 60
        ? "#eab308"
        : "#dc2626",
  }}
>
  Match Score: {score}%
</h3>

<p>
  {score >= 80
    ? "Excellent match! Your resume fits this role very well."
    : score >= 60
    ? "Good match. A few additional skills could improve your chances."
    : "Low match. Consider adding the missing skills to your resume."}
</p>

<h4>Matched Skills</h4>

<div>
  {matchedSkills.map((skill) => (
    <span key={skill} className="job-skill-chip">
      {skill}
    </span>
  ))}
</div>
<h4>Missing Skills</h4>

<div>
  {missingSkills.length > 0 ? (
    missingSkills.map((skill) => (
      <span key={skill} className="job-skill-chip">
        {skill}
      </span>
    ))
  ) : (
    <p>None 🎉</p>
  )}
</div>
      </div>
            <div className="job-match-card">
        <h2>AI Recommendation</h2>

        {score >= 80 ? (
          <p>✅ You are highly suitable for this role. Apply confidently.</p>
        ) : score >= 60 ? (
          <p>🟡 You have a good chance. Improve the missing skills to increase your match.</p>
        ) : (
          <p>🔴 Consider learning the missing skills before applying.</p>
        )}
      </div>

    </div> {/* job-match-container */}

  </div> {/* job-match-wrapper */}

</div> 
);
}

export default JobMatch;