import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/CandidateReport.css";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

function CandidateReport() {
  const navigate = useNavigate();
  const { state } = useLocation();

const analysis = state?.analysis;
const applicant = state?.applicant;
const job = state?.job;

const isRecruiterView = !!job;

const calculateMatchScore = () => {
  if (!analysis || !job) return 0;

  const resumeSkills =
    analysis.technicalSkills?.map((s) => s.toLowerCase()) || [];

  const jobSkills =
    job.requiredSkills?.map((s) => s.toLowerCase()) || [];

  const matchedSkills = resumeSkills.filter((skill) =>
    jobSkills.includes(skill)
  );

  const skillScore =
    jobSkills.length > 0
      ? (matchedSkills.length / jobSkills.length) * 60
      : 0;

  let titleScore = 0;

  if (
    analysis.professionalSummary
      ?.toLowerCase()
      .includes(job.jobTitle.toLowerCase())
  ) {
    titleScore = 20;
  }

  let projectScore = 0;

  const projects =
    analysis.projects?.join(" ").toLowerCase() || "";

  matchedSkills.forEach((skill) => {
    if (projects.includes(skill)) {
      projectScore += 4;
    }
  });

  projectScore = Math.min(projectScore, 20);

  return Math.round(skillScore + titleScore + projectScore);
};

const aiMatch = calculateMatchScore();

const matchedSkills =
  analysis?.technicalSkills?.filter((skill) =>
    job?.requiredSkills?.some(
      (req) => req.toLowerCase() === skill.toLowerCase()
    )
  ) || [];

const missingSkills =
  job?.requiredSkills?.filter(
    (req) =>
      !analysis?.technicalSkills?.some(
        (skill) => skill.toLowerCase() === req.toLowerCase()
      )
  ) || [];

  const downloadPDF = () => {
  const element = document.getElementById("resume-report");

  const options = {
    margin: 10,
    filename: `${applicant.studentName}_AI_Report.pdf`,
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["css", "legacy"],
      avoid: [".report-card", ".score-card"],
    },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      toast.success("AI Resume Report downloaded successfully!");
    })
    .catch(() => {
      toast.error("Failed to download report.");
    });
};

  if (!analysis) {
    return (
      <div className="report-container">
        <h2>No report found.</h2>
        <button
          className="back-btn"
          onClick={() => navigate("/recruiter-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  return (
  <div className="report-container">

    {/* Buttons - NOT included in PDF */}
    <div className="report-actions">
      <button
        className="report-back-btn"
        onClick={() => navigate("/recruiter-dashboard")}
      >
        ← Back to Dashboard
      </button>

      <button
        className="report-download-btn"
        onClick={downloadPDF}
      >
        📄 Download PDF
      </button>
    </div>

    {/* Everything inside this div will be included in the PDF */}
    <div id="resume-report">

      <div className="report-header">
  <h1>👤 Candidate Evaluation Report</h1>

  <div className="candidate-overview">

    <p>
      <strong>Candidate Name:</strong> {applicant.studentName}
    </p>

    <p>
      <strong>Email:</strong> {applicant.studentEmail}
    </p>

    <p>
      <strong>Applied Role:</strong> {applicant.jobTitle}
    </p>

    <p>
      <strong>Company:</strong> {applicant.companyName}
    </p>

  </div>

  <hr />
</div>

<div
  className={`report-card recommendation-card ${
    aiMatch >= 80
      ? "excellent-card"
      : aiMatch >= 60
      ? "good-card"
      : "poor-card"
  }`}
>
  <h2 style={{ textAlign: "center" }}>
  📊 Candidate Scores
</h2>

  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      gap: "40px",
      flexWrap: "wrap",
      marginTop: "20px",
    }}
  >
    {/* ATS Score */}
    <div style={{ width: "170px", textAlign: "center" }}>
      <CircularProgressbar
        value={analysis.atsScore}
        text={`${analysis.atsScore}%`}
        styles={buildStyles({
          pathColor:
            analysis.atsScore >= 80
              ? "#22c55e"
              : analysis.atsScore >= 60
              ? "#f59e0b"
              : "#ef4444",
          textColor: "#111827",
          trailColor: "#e5e7eb",
        })}
      />

      <h3 style={{ marginTop: "15px" }}>ATS Score</h3>
      <p style={{ marginTop: "10px", color: "#6b7280", fontWeight: "500" }}>
  {analysis.atsScore >= 80
    ? "Excellent Resume"
    : analysis.atsScore >= 60
    ? "Good Resume"
    : "Needs Improvement"}
</p>
    </div>

    {/* AI Match */}
    <div style={{ width: "170px", textAlign: "center" }}>
      <CircularProgressbar
        value={aiMatch}
        text={`${aiMatch}%`}
        styles={buildStyles({
          pathColor:
            aiMatch >= 80
              ? "#2563eb"
              : aiMatch >= 60
              ? "#f59e0b"
              : "#ef4444",
          textColor: "#111827",
          trailColor: "#e5e7eb",
        })}
      />

      <h3 style={{ marginTop: "15px" }}>AI Job Match</h3>
      <p style={{ marginTop: "10px", color: "#6b7280", fontWeight: "500" }}>
  {aiMatch >= 80
    ? "Strong Candidate"
    : aiMatch >= 60
    ? "Good Candidate"
    : "Average Match"}
</p>
    </div>
  </div>
</div>

      {isRecruiterView && (
  <div
  className={`report-card recommendation-card ${
    aiMatch >= 80
      ? "excellent-card"
      : aiMatch >= 60
      ? "good-card"
      : "poor-card"
  }`}
>
    <h2>🤖 AI Hiring Recommendation</h2>

<p
  style={{
    color: "#6b7280",
    marginBottom: "20px",
  }}
>
  AI evaluation based on resume quality, required skills, and project relevance.
</p>

<h3
  style={{
    fontSize: "24px",
    marginBottom: "15px",
    color:
      aiMatch >= 80
        ? "#15803d"
        : aiMatch >= 60
        ? "#b45309"
        : "#b91c1c",
  }}
>
  {aiMatch >= 80
    ? "Excellent Fit"
    : aiMatch >= 60
    ? "Good Fit"
    : "Moderate Fit"}
</h3>

<p>
  {aiMatch >= 80
    ? "Candidate possesses most of the required technical skills, relevant project experience, and demonstrates strong alignment with the job requirements. Highly recommended for interview."
    : aiMatch >= 60
    ? "Candidate satisfies many of the job requirements but has a few skill gaps. Recommended for technical evaluation before the final hiring decision."
    : "Candidate currently lacks several important skills required for this role. Consider only if transferable skills or additional training are acceptable."}
</p>
  </div>
)}

<div className="report-card">
  <h2>✅ Skill Comparison</h2>

  <h3 style={{ color: "#16a34a", marginTop: "20px" }}>
    ✔ Matched Skills
  </h3>

  <ul>
    {matchedSkills.map((skill) => (
      <li key={skill}>{skill}</li>
    ))}
  </ul>

  <hr style={{ margin: "20px 0" }} />

  <h3 style={{ color: "#dc2626" }}>
    ✖ Missing Skills
  </h3>

  <ul>
    {missingSkills.map((skill) => (
      <li key={skill}>{skill}</li>
    ))}
  </ul>
</div>

      <div className="report-card">
        <h2>📂 Project Experience</h2>

        <ul>
          {analysis.projects.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>

      <div className="report-card strength-card">
        <h2>⭐ Why this Candidate Stands Out</h2>

        <ul>
          {analysis.strengths.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      
<div className="report-card weakness-card">
        <h2>⚠ Potential Concerns</h2>

        <ul>
          {analysis.weaknesses.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      

    </div> {/* resume-report */}

  </div> /* report-container */
);
}


export default CandidateReport;