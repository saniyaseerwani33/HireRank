import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/MyApplications.css";
import { Link, useNavigate } from "react-router-dom";

function MyApplications() {
  const student = JSON.parse(
  localStorage.getItem("student") ||
  sessionStorage.getItem("student")
);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const navigate = useNavigate();

return (
  <div className="applications-container">

    <div className="applications-content">

      <div className="applications-header">
        <button
          className="back-btn"
          onClick={() => navigate("/student-dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1>📋 My Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="empty-card">
          <h3>No applications yet</h3>
          <p>Start applying for jobs to see them here.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div key={application._id} className="application-card">
              <h2>{application.jobTitle}</h2>

              <p><strong>Company:</strong> {application.companyName}</p>

              <p>
                <strong>Status:</strong>
                <span className={`status ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>

  </div>
);
}

export default MyApplications;