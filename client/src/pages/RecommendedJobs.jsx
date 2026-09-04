import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "../styles/RecommendedJobs.css";

function RecommendedJobs() {
  const navigate = useNavigate();

  const student = JSON.parse(
  localStorage.getItem("student") ||
  sessionStorage.getItem("student")
);

  const [jobs, setJobs] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await API.get("/jobs");
      const studentRes = await API.get(`/students/${student._id}`);
      const applicationRes = await API.get(
  `/applications/student/${student.email}`
);
      setJobs(jobsRes.data);
      setAnalysis(studentRes.data.aiAnalysis);
      setApplications(applicationRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
  try {
    setApplyingJobId(job._id);

    await API.post("/applications/apply", {
      studentName: student.fullName,
      studentEmail: student.email,
      jobId: job._id,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
    });

    toast.success("Application submitted successfully!");

    fetchData(); // Refrseshes the page so the button changes to "Applied"
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to apply");
  } finally {
    setApplyingJobId(null);
  }
};
  
  if (loading) {
    return <h2>Loading recommendations...</h2>;
  }

  if (!analysis) {
    return (
      <div className="recommended-page">
        <button
          className="back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Back
        </button>

        <h2>No AI Resume Analysis Found</h2>
        <p>Please upload your resume first.</p>
      </div>
    );
  }

  const recommendedJobs = jobs
  .map((job) => {
    const resumeSkills =
      analysis.technicalSkills?.map((skill) => skill.toLowerCase()) || [];

    const jobSkills =
      job.requiredSkills?.map((skill) => skill.toLowerCase()) || [];

    const matchedSkills = resumeSkills.filter((skill) =>
      jobSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(
      (skill) => !resumeSkills.includes(skill)
    );

    // Skills Score (60%)
    const skillScore =
      jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 60
        : 0;

    // Job Title Score (20%)
    let titleScore = 0;

    const summary = analysis.professionalSummary?.toLowerCase() || "";
    const jobTitle = job.jobTitle.toLowerCase();

    if (summary.includes(jobTitle)) {
      titleScore = 20;
    }

    // Experience/Projects Score (20%)
    let projectScore = 0;

    const projects =
      analysis.projects?.join(" ").toLowerCase() || "";

    matchedSkills.forEach((skill) => {
      if (projects.includes(skill)) {
        projectScore += 4;
      }
    });

    projectScore = Math.min(projectScore, 20);

    const matchScore = Math.round(
      skillScore + titleScore + projectScore
    );

    const alreadyApplied = applications.some(
  (app) => app.jobId === job._id
);

    return {
      ...job,
      matchScore,
      matchedSkills,
      missingSkills,
      alreadyApplied,
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore);

  return (
  <div className="recommended-page">
  <div className="recommended-wrapper">

    <div className="recommended-actions">
      <button
        className="recommended-back-btn"
        onClick={() => navigate("/student-dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>

    <div className="recommended-content">
      <h1>⭐ AI Recommended Jobs</h1>

      <div className="recommended-jobs-container">
  {recommendedJobs.map((job, index) => (
    <div
  key={job._id}
  className={`recommended-job-card ${
    index === 0 ? "top-match" : ""
  }`}
>
{index === 0 && (
  <span className="rank-badge gold">🥇 Top Match</span>
)}

{index === 1 && (
  <span className="rank-badge silver">🥈 Strong Match</span>
)}

{index === 2 && (
  <span className="rank-badge bronze">🥉 Good Match</span>
)}

<h2>{job.jobTitle}</h2>

      <p><strong>Company:</strong> {job.companyName}</p>

      <p><strong>Location:</strong> {job.location}</p>

      <p><strong>Salary:</strong> {job.salary}</p>

      <h3>🤖 Match Score: {job.matchScore}%</h3>

      <p>
        <strong>Matched Skills:</strong>{" "}
        {job.matchedSkills.length
          ? job.matchedSkills.join(", ")
          : "None"}
      </p>

      <p>
        <strong>Missing Skills:</strong>{" "}
        {job.missingSkills.length
          ? job.missingSkills.join(", ")
          : "None 🎉"}
      </p>

      {job.alreadyApplied ? (
  <button className="applied-btn" disabled>
    ✅ Applied
  </button>
) : (
  <button
  className="apply-btn"
  onClick={() => handleApply(job)}
  disabled={applyingJobId === job._id}
>
  {applyingJobId === job._id ? "Applying..." : "Apply Now"}
</button>
)}

    </div>
  ))}
</div>
    </div>
    </div>
    </div>
  );
}

export default RecommendedJobs;