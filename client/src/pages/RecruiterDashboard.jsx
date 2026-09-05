import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "../styles/RecruiterDashboard.css";


function RecruiterDashboard() {
  const recruiter = JSON.parse(
  localStorage.getItem("recruiter") ||
  sessionStorage.getItem("recruiter")
);
if (!recruiter) {
  navigate("/recruiter-login");
  return null;
}
  const navigate = useNavigate();


  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);


  const [applications, setApplications] = useState([]);
  const [jobsPosted, setJobsPosted] = useState(0);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);


  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [minATS, setMinATS] = useState(0);


  useEffect(() => {
  fetchApplications();
  fetchJobsPosted();

  const interval = setInterval(() => {
    fetchApplications();
    fetchJobsPosted();
  }, 5000); // Refresh every 5 seconds

  return () => clearInterval(interval);
}, []);


  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications", {
        params: {
          recruiterEmail: recruiter.email,
        },
      });


      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchJobsPosted = async () => {
    try {
      const response = await API.get("/jobs");


      const jobs = response.data.filter(
        (job) => job.recruiterEmail === recruiter.email
      );


      setJobsPosted(jobs.length);
      setMyJobs(jobs);
    } catch (error) {
      console.log(error);
    }
  };


  const handlePostJob = async (e) => {
    e.preventDefault();


    try {
      setLoading(true);


      if (editingJobId) {
        await API.put(`/jobs/${editingJobId}`, {
          jobTitle,
          companyName: recruiter.companyName,
          location,
          salary,
          description,
          requiredSkills: requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
          recruiterEmail: recruiter.email,
        });


        toast.success("Job updated successfully!");
      } else {
        const response = await API.post("/jobs/create", {
          jobTitle,
          companyName: recruiter.companyName,
          location,
          salary,
          description,
          requiredSkills: requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
          recruiterEmail: recruiter.email,
        });


        toast.success(response.data.message);
      }


      setJobTitle("");
      setLocation("");
      setSalary("");
      setDescription("");
      setRequiredSkills("");
      setEditingJobId(null);


      fetchJobsPosted();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };


  const handleEditJob = (job) => {
    setEditingJobId(job._id);


    setJobTitle(job.jobTitle);
    setLocation(job.location);
    setSalary(job.salary);
    setDescription(job.description);
    setRequiredSkills(job.requiredSkills?.join(", ") || "");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;


    try {
      await API.delete(`/jobs/${jobId}`);


      toast.success("Job deleted.");


      fetchJobsPosted();
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };


  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);


      await API.put(`/applications/${id}`, {
        status,
      });


      toast.success("Status Updated");
      fetchApplications();
    } catch (error) {
      toast.error("Failed");
    } finally {
      setUpdatingId(null);
    }
  };


  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;


    localStorage.removeItem("recruiter");
sessionStorage.removeItem("recruiter");
    navigate("/recruiter-login");
  };


  const totalApplications = applications.length;


  const acceptedApplications = applications.filter(
    (app) => app.status === "Accepted"
  ).length;


  const pendingApplications = applications.filter(
    (app) => app.status === "Pending"
  ).length;


  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected"
  ).length;


  const calculateMatchScore = (analysis, job) => {
    if (!analysis || !job) return 0;


    const resumeSkills =
      analysis.technicalSkills?.map((skill) =>
        skill.toLowerCase()
      ) || [];


    const jobSkills =
      job.requiredSkills?.map((skill) =>
        skill.toLowerCase()
      ) || [];


    const matchedSkills = resumeSkills.filter((skill) =>
      jobSkills.includes(skill)
    );


    const skillScore =
      jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 60
        : 0;


    let titleScore = 0;


    const summary =
      analysis.professionalSummary?.toLowerCase() || "";


    if (summary.includes(job.jobTitle.toLowerCase())) {
      titleScore = 20;
    }


    let projectScore = 0;


    const projects =
      analysis.projects?.join(" ").toLowerCase() || "";


    matchedSkills.forEach((skill) => {
      if (projects.includes(skill)) projectScore += 4;
    });


    projectScore = Math.min(projectScore, 20);


    return Math.round(skillScore + titleScore + projectScore);
  };

const jobApplications = selectedJob
  ? applications.filter(
      (app) => app.jobTitle === selectedJob.jobTitle
    )
  : [];

const filteredApplications = jobApplications.filter(
  (application) =>
    (application.aiAnalysis?.atsScore || 0) >= Number(minATS || 0)
);
  return (
  <div className="recruiter-dashboard">


    {/* ================= NAVBAR ================= */}


    <nav className="recruiter-navbar">
      <h2>HireRank</h2>


      <div className="recruiter-nav-links">
        <button onClick={() => navigate("/recruiter-profile")}>
          Profile
        </button>


        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>


    {/* ================= CONTENT ================= */}


    <div className="recruiter-content">


      {/* Recruiter Info */}


      <div className="recruiter-header-card">


        <h1>
          Welcome, {recruiter?.recruiterName}! 👋
        </h1>


        <div className="recruiter-info-grid">


          <div className="recruiter-info-item">
            <span>Company</span>
            <strong>{recruiter?.companyName}</strong>
          </div>


          <div className="recruiter-info-item">
            <span>Email</span>
            <strong>{recruiter?.email}</strong>
          </div>


        </div>


      </div>


      {/* Statistics */}


      <div className="stats-grid">
  <div className="stats-card">
    <h3>{jobsPosted}</h3>
    <p>Jobs Posted</p>
  </div>

  <div className="stats-card">
    <h3>{totalApplications}</h3>
    <p>Applications</p>
  </div>

  <div className="stats-card">
    <h3>{acceptedApplications}</h3>
    <p>Accepted</p>
  </div>

  <div className="stats-card">
    <h3>{pendingApplications}</h3>
    <p>Pending</p>
  </div>

  <div className="stats-card">
    <h3>{rejectedApplications}</h3>
    <p>Rejected</p>
  </div>
</div>


      {/* ================= POST JOB ================= */}


      <div className="job-form-card">


        <h2>
          {editingJobId ? "Edit Job" : "Post a New Job"}
        </h2>


        <form
          className="recruiter-job-form"
          onSubmit={handlePostJob}
        >


          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />


          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />


          <input
            type="text"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />


          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />


          <input
            type="text"
            placeholder="Required Skills (comma separated)"
            value={requiredSkills}
            onChange={(e) =>
              setRequiredSkills(e.target.value)
            }
          />

  <button
    className="post-job-btn"
    type="submit"
    disabled={loading}
  >
    {loading
      ? editingJobId
        ? "Updating..."
        : "Posting..."
      : editingJobId
      ? "Update Job"
      : "Post Job"}
  </button>


        </form>


      </div>


      {/* ================= MY JOBS ================= */}


      <h2 className="recruiter-section-title">
        My Posted Jobs
      </h2>
      {myJobs.length === 0 ? (
  <p className="empty-text">
    You haven't posted any jobs yet.
  </p>
) : (
  <div className="recruiter-jobs-grid">


    {myJobs.map((job) => (


      <div
        key={job._id}
        className={`recruiter-job-card ${
          selectedJob?._id === job._id
            ? "selected-job"
            : ""
        }`}
      >


        <h3>{job.jobTitle}</h3>


        <p>
          <strong>Location:</strong> {job.location}
        </p>


        <p>
          <strong>Salary:</strong> {job.salary}
        </p>


        <p className="job-description">
  <strong>Description:</strong>
  <br />
  {job.description}
</p>

<p className="job-skills">
  <strong>Required Skills:</strong>
  <br />
  {job.requiredSkills?.join(", ")}
</p>


        <p>
          <strong>Applications:</strong>{" "}
          {
            applications.filter(
              (app) =>
                app.jobTitle === job.jobTitle
            ).length
          }
        </p>


        <div className="recruiter-job-actions">


          <button
            className="edit-btn"
            onClick={() => handleEditJob(job)}
          >
            Edit
          </button>


          <button
            className="delete-btn"
            onClick={() => handleDeleteJob(job._id)}
          >
            Delete
          </button>


          <button
            className="view-btn"
            onClick={() => setSelectedJob(job)}
          >
            View Applications
          </button>


        </div>


      </div>


    ))}


  </div>
)}

{selectedJob && (
  <div className="applications-toolbar">

  <h2 className="applications-heading">
    {selectedJob
    ? `Applications for ${selectedJob.jobTitle}`
    : "Job Applications"}
  </h2>

  <div className="toolbar-right">

    <div className="ats-filter">
      <label>Minimum ATS Score</label>

      <select
        value={minATS}
        onChange={(e) => setMinATS(e.target.value)}
      >
        <option value="">All</option>
        <option value="40">40+</option>
        <option value="50">50+</option>
        <option value="60">60+</option>
        <option value="70">70+</option>
        <option value="80">80+</option>
      </select>
    </div>

    <button
      className="close-applications-btn"
      onClick={() => setSelectedJob(null)}
    >
      ✕ Hide Applications
    </button>

  </div>

</div>
)}

{selectedJob ? (

  jobApplications.length === 0 ? (

    <p className="empty-text">
      No applications for this job yet.
    </p>

  ) : filteredApplications.length === 0 ? (

    <div className="no-applications">
      <div className="empty-icon">📭</div>
  <h3>No applications found</h3>
  <p>Try selecting a different ATS score filter.</p>
    </div>

  ) : (

    <div className="applications-grid">

      {filteredApplications
        .sort((a, b) => {
          const scoreA = calculateMatchScore(a.aiAnalysis, selectedJob);
          const scoreB = calculateMatchScore(b.aiAnalysis, selectedJob);
          return scoreB - scoreA;
        })
        .map((application, index) => {


          const aiMatch =
            calculateMatchScore(
              application.aiAnalysis,
              selectedJob
            );


          return (


            <div
              key={application._id}
              className="application-card"
            >


              <h3>{application.jobTitle}</h3>


              <h4>


                {index === 0
                  ? "🥇 Rank #1"
                  : index === 1
                  ? "🥈 Rank #2"
                  : index === 2
                  ? "🥉 Rank #3"
                  : `🏅 Rank #${index + 1}`}


              </h4>


              <p>
                <strong>Student:</strong>{" "}
                {application.studentName}
              </p>


              <p>
                <strong>Email:</strong>{" "}
                {application.studentEmail}
              </p>


              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>


              <p className="ats-score">
                ATS Score:{" "}
                {application.aiAnalysis?.atsScore}/100
              </p>


              <p className="ai-match">
                AI Match: {aiMatch}%
              </p>


              <div className="application-buttons">

  <div className="report-btn-wrapper">
    {application.aiAnalysis ? (
      <button
        className="report-btn"
        onClick={() =>
          navigate("/candidate-report", {
            state: {
              analysis: application.aiAnalysis,
              applicant: application,
              job: selectedJob,
            },
          })
        }
      >
        📄 View AI Report
      </button>
    ) : (
      <button className="report-btn disabled" disabled>
        📄 AI Report Not Available
      </button>
    )}
  </div>

  {application.resume && (
    <a
      className="resume-link"
      href={`http://localhost:5000/uploads/${application.resume}`}
      target="_blank"
      rel="noreferrer"
    >
      📄 View Resume
    </a>
  )}

</div>


              {application.status ===
              "Pending" ? (


                <div className="application-actions">


                  <button
  className="accept-btn"
  onClick={() =>
    updateStatus(application._id, "Accepted")
  }
                    disabled={
                      updatingId ===
                      application._id
                    }
                  >
                    Accept
                  </button>


                  <button
  className="reject-btn"
  onClick={() =>
    updateStatus(application._id, "Rejected")
  }
                    disabled={
                      updatingId ===
                      application._id
                    }
                  >
                    Reject
                  </button>


                </div>


              ) : (


                <div
                  className={`status-badge ${application.status.toLowerCase()}`}
                >
                  {application.status}
                </div>


              )}


            </div>


          );
        })}


    </div>


  )


) : (


  <p className="empty-text">
    Click <strong>View Applications</strong> to see applicants.
  </p>


)}
      </div>
    </div>
  );
}


export default RecruiterDashboard;