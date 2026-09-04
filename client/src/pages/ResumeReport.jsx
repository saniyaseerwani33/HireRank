import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/ResumeReport.css";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

function ResumeReport() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const analysis = state?.analysis;

  const downloadPDF = () => {
  const element = document.getElementById("resume-report");

  const options = {
    margin: 10,
    filename: `${analysis.candidateName}_AI_Resume_Report.pdf`,
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
      <div className="resume-container">
        <h2>No report found.</h2>
        <button
          className="back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

return (
  <div className="resume-page">
    <div className="resume-wrapper">

      <div className="resume-actions">
        <button
          className="resume-back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Back to Dashboard
        </button>

        <button
          className="resume-download-btn"
          onClick={downloadPDF}
        >
          📄 Download PDF
        </button>
      </div>

      <div id="resume-report" className="resume-container">
        {/* entire report */}
        <div className="resume-header">
          <h1>🤖 AI Resume Analysis Report</h1>
          <p>
            Detailed AI-powered resume evaluation and ATS compatibility report.
          </p>
          <hr />
        </div>

      <div className="resume-card resume-score-card">
        <h2>🎯 ATS Compatibility Score</h2>

        <div className="resume-score-box">
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
        </div>

        <h3
          className={`resume-score-status ${
  analysis.atsScore >= 80
    ? "excellent"
    : analysis.atsScore >= 60
    ? "good"
    : "poor"
}`}
        >
          {analysis.atsScore >= 80
            ? "Excellent"
            : analysis.atsScore >= 60
            ? "Good"
            : "Needs Improvement"}
        </h3>

        <p className="resume-score-description">
          {analysis.atsScore >= 80
            ? "Your resume is highly ATS-friendly and has a strong chance of passing automated screening."
            : analysis.atsScore >= 60
            ? "Your resume is good but can be improved by adding more relevant keywords and stronger project descriptions."
            : "Your resume requires significant improvements to increase ATS compatibility."}
        </p>
      </div>

      <div className="resume-card">
        <h2>📝 Overall Assessment</h2>

        <p>
          {analysis.atsScore >= 80
            ? "Your resume is well-structured and ATS-friendly. It demonstrates strong technical skills and has a high chance of passing applicant tracking systems."
            : analysis.atsScore >= 60
            ? "Your resume has a solid foundation, but improving project descriptions, adding relevant keywords, and refining formatting will make it more competitive."
            : "Your resume requires improvements in formatting, keyword optimization, and project descriptions to improve ATS compatibility and recruiter appeal."}
        </p>
      </div>

      <div className="resume-card">
        <h2>Candidate Details</h2>
        <p><strong>Name:</strong> {analysis.candidateName}</p>
        <p><strong>Email:</strong> {analysis.contact.email}</p>
        <p><strong>Phone:</strong> {analysis.contact.phone}</p>
        <p><strong>Location:</strong> {analysis.contact.location}</p>
      </div>

      <div className="resume-card">
        <h2>Professional Summary</h2>
        <p>{analysis.professionalSummary}</p>
      </div>

      <div className="resume-card">
        <h2>Technical Skills</h2>

        {analysis.technicalSkills.map((skill) => (
          <span key={skill} className="resume-skill-chip">
            {skill}
          </span>
        ))}
      </div>

      <div className="resume-card">
        <h2>Education</h2>
        <p>{analysis.education}</p>
      </div>

      <div className="resume-card">
        <h2>Experience</h2>
        <p>{analysis.experience}</p>
      </div>

      <div className="resume-card">
        <h2>Projects</h2>

        <ul>
          {analysis.projects.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>

      <div className="resume-card resume-strength-card">
        <h2>Strengths</h2>

        <ul>
          {analysis.strengths.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      
<div className="resume-card resume-weakness-card">
        <h2>Weaknesses</h2>

        <ul>
          {analysis.weaknesses.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="resume-card resume-keyword-card">
        <h2>Missing Keywords</h2>

        {analysis.missingKeywords.map((item) => (
          <span key={item} className="resume-skill-chip">
            {item}
          </span>
        ))}
      </div>

            <div className="resume-card resume-suggestion-card">
        <h2>Suggestions</h2>

        <ul>
          {analysis.suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      </div>

    </div>
  </div>
);
}

export default ResumeReport;