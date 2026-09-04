import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/StudentDashboard.css";


function StudentDashboard() {
  const student = JSON.parse(
  localStorage.getItem("student") ||
  sessionStorage.getItem("student")
);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  
  const getScoreColor = (score) => {
  if (score >= 71) return "#16a34a";
  if (score >= 41) return "#eab308";
  return "#dc2626";
};

  useEffect(() => {
  fetchJobs();
  fetchApplications();
  fetchStudent();
}, []);

const fetchJobs = async () => {
  try {
    setLoading(true);
    const response = await API.get("/jobs");
    setJobs(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const fetchApplications = async () => {
  try {
    const response = await API.get(
      `/applications/student/${student.email}`
    );

    setApplications(response.data);
  } catch (error) {
    console.log(error);
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
    fetchApplications();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to apply");
  } finally {
    setApplyingJobId(null);
  }
};

const handleMatch = async (job) => {
  if (!analysis) {
    toast.warning("Please upload your resume first to use AI Job Match.");
    return;
  }

  navigate("/job-match", {
    state: {
      analysis,
      job,
    },
  });
};

const handleUpload = async () => {
  if (!resume) {
    alert("Please select a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resume);

  setUploading(true);

  try {
    const response = await API.put(
      `/students/upload-resume/${student._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Resume uploaded successfully!");

    setAnalysis(response.data.analysis);
    setResumeUploaded(true);

  } catch (error) {
    toast.error(error.response?.data?.message || "Upload failed");
  }
  finally {
  setUploading(false);
}
};

const fetchStudent = async () => {
  try {
    const response = await API.get(`/students/${student._id}`);

    if (response.data.aiAnalysis) {
      setAnalysis(response.data.aiAnalysis);
    }
    if (response.data.resume) {
  setResumeUploaded(true);
}
  } catch (error) {
    console.log(error);
  }
};

  const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  localStorage.removeItem("student");
localStorage.removeItem("token");

sessionStorage.removeItem("student");
sessionStorage.removeItem("token");
  navigate("/student-login");
};

  const totalApplications = applications.length;

const acceptedApplications = applications.filter(
  (app) => app.status === "Accepted"
).length;

const rejectedApplications = applications.filter(
  (app) => app.status === "Rejected"
).length;

const pendingApplications = applications.filter(
  (app) => app.status === "Pending"
).length;

const filteredJobs = jobs
  .filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  )
  .map((job) => {
    const resumeSkills =
      analysis?.technicalSkills?.map((skill) => skill.toLowerCase()) || [];

    const jobSkills =
      job.requiredSkills?.map((skill) => skill.toLowerCase()) || [];

    const matchedSkills = resumeSkills.filter((skill) =>
      jobSkills.includes(skill)
    );

    const matchScore =
      jobSkills.length > 0
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

    return {
      ...job,
      matchScore,
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore);

  return (
  <div className="dashboard-container">
    <nav className="dashboard-navbar">
      <h2>HireRank</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a
  href="#available-jobs"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById("available-jobs")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Jobs
</a>
        <Link to="/my-applications">My Applications</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>

    <div className="dashboard-content">
      <h1>Welcome, {student?.fullName}! 👋</h1>
      <p>Find internships and jobs that match your skills.</p>

      <div className="stats-container">
        <div className="card">
          <h3>{totalApplications}</h3>
          <p>Total Applications</p>
        </div>

        <div className="card">
          <h3>{acceptedApplications}</h3>
          <p>Accepted</p>
        </div>

        <div className="card">
          <h3>{pendingApplications}</h3>
          <p>Pending</p>
        </div>

        <div className="card">
          <h3>{rejectedApplications}</h3>
          <p>Rejected</p>
        </div>

        <div className="card">
  <h3>{analysis ? `${analysis.atsScore}%` : "--"}</h3>
  <p>Latest ATS Score</p>
</div>
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <button
  onClick={handleUpload}
  disabled={uploading}
>
  {uploading ? "🤖 Analyzing Resume..." : "Upload Resume"}
</button>

{resumeUploaded && (
  <div className="resume-status">
    <h4>📄 Resume Status</h4>
    <p>✅ Resume Uploaded</p>
    <p>You can upload another resume anytime to update your AI report.</p>
  </div>
)}
      </div>

      {analysis && (
  <div className="analysis-box">
    <h2>🤖 AI Resume Analysis</h2>

    <div
      style={{
        width: "170px",
        margin: "20px auto",
      }}
    >
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

    <h3 style={{ textAlign: "center" }}>
      ATS Score: {analysis.atsScore}/100
    </h3>

    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() =>
          navigate("/resume-report", {
            state: { analysis },
          })
        }
      >
        📄 View Full AI Report
      </button>
    </div>
  </div>
)}

<div className="recent-applications">
  <h2>📋 Recent Applications</h2>
  <br></br>

  {applications.length === 0 ? (
    <p>You haven't applied to any jobs yet.</p>
  ) : (
    <div className="recent-app-grid">
      {applications.slice(0, 3).map((app) => (
        <div key={app._id} className="recent-app-card">
          <h4>{app.jobTitle}</h4>

          <p>
            <strong>Company:</strong> {app.companyName}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${app.status.toLowerCase()}`}>
              {app.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  )}
</div>

<div className="quick-actions">
  <h2>⚡ Quick Actions</h2>
  <br></br>

  <div className="quick-actions-grid">

    <button
      onClick={() => document.querySelector('input[type="file"]').click()}
    >
      📄 Upload Resume
    </button>

    <button
      onClick={() =>
        navigate("/resume-report", {
          state: { analysis },
        })
      }
      disabled={!analysis}
    >
      🤖 View AI Report
    </button>

    <button
      onClick={() =>
        document
          .querySelector(".search-box")
          .scrollIntoView({ behavior: "smooth" })
      }
    >
      💼 Browse Jobs
    </button>

    <button
      onClick={() => navigate("/my-applications")}
    >
      📋 My Applications
    </button>

  </div>
</div>

<div className="recommend-card">
  <div>
    <h2>⭐ AI Recommended Jobs</h2>
    <p>
      Discover jobs ranked according to your resume, skills and AI analysis.
    </p>
  </div>

  <button
    className="recommend-btn"
    onClick={() => navigate("/recommended-jobs")}
  >
    View Recommendations →
  </button>
</div>
      
      <input
        className="search-box"
        type="text"
        placeholder="Search by job title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading-text">Loading jobs...</p>
      ) : (
        <>
          <h2 id="available-jobs">Available Jobs</h2>
          <br></br>

          <div className="jobs-container">
            {jobs.length === 0 ? (
              <p>No jobs available.</p>
            ) : (
              filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="job-card"
                  >
                    <h3>{job.jobTitle}</h3>
                    <p><strong>Company:</strong> {job.companyName}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                    <p>
  <strong>🤖 AI Match:</strong> {job.matchScore}%
</p>
                    <p>{job.description}</p>

                    {applications.some(app => app.jobId === job._id) ? (
                      <button disabled>Applied</button>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        disabled={applyingJobId === job._id}
                      >
                        {applyingJobId === job._id ? "Applying..." : "Apply"}
                      </button>
                    )}
                    <button
  className="match-btn"
  onClick={() => handleMatch(job)}
>
  🤖 Match Resume
</button>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      <div className="dashboard-cards">
        <div className="card">
          <h3>Available Jobs</h3>
          <p>Browse the latest job opportunities.</p>
        </div>

        <div className="card">
          <h3>My Applications</h3>
          <p>Track all the jobs you've applied for.</p>
        </div>

        <div className="card">
          <h3>Profile</h3>
          <p>Update your personal information and resume.</p>
        </div>
      </div>
    </div>
  </div>
);
}

export default StudentDashboard;