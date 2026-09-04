import { Link } from "react-router-dom";
import "../styles/RecruiterProfile.css";

function RecruiterProfile() {
  const recruiter = JSON.parse(localStorage.getItem("recruiter"));

  return (
    <div className="recruiter-profile-page">
      <div className="recruiter-profile-card">

        <div className="recruiter-profile-avatar">
          {recruiter.recruiterName.charAt(0).toUpperCase()}
        </div>

        <h2>Recruiter Profile</h2>

        <div className="recruiter-profile-info">
          <div className="profile-row">
            <label>Name</label>
            <span>{recruiter.recruiterName}</span>
          </div>

          <div className="profile-row">
            <label>Company</label>
            <span>{recruiter.companyName}</span>
          </div>

          <div className="profile-row">
            <label>Email</label>
            <span>{recruiter.email}</span>
          </div>
        </div>

        <Link to="/recruiter-dashboard">
          <button className="recruiter-back-btn">
            ← Back to Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
}

export default RecruiterProfile;