import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "../styles/StudentProfile.css";

function StudentProfile() {
  const navigate = useNavigate();

  const student = JSON.parse(
  localStorage.getItem("student") ||
  sessionStorage.getItem("student")
);

  const [formData, setFormData] = useState({
    fullName: student.fullName,
    college: student.college || "",
    branch: student.branch || "",
    graduationYear: student.graduationYear || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await API.put(
        `/students/update/${student._id}`,
        formData
      );

      toast.success(response.data.message);

      localStorage.setItem(
        "student",
        JSON.stringify(response.data.student)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        <div className="profile-actions">
          <button
            className="profile-back-btn"
            onClick={() => navigate("/student-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="profile-card">
          <h1>👤 Student Profile</h1>

          <form onSubmit={handleUpdate}>

  <div className="form-row">
    <label>Full Name</label>
    <input
      type="text"
      name="fullName"
      value={formData.fullName}
      onChange={handleChange}
    />
  </div>

  <div className="form-row">
    <label>College</label>
    <input
      type="text"
      name="college"
      value={formData.college}
      onChange={handleChange}
    />
  </div>

  <div className="form-row">
    <label>Branch</label>
    <input
      type="text"
      name="branch"
      value={formData.branch}
      onChange={handleChange}
    />
  </div>

  <div className="form-row">
    <label>Graduation Year</label>
    <input
      type="number"
      name="graduationYear"
      value={formData.graduationYear}
      onChange={handleChange}
    />
  </div>

  <button type="submit" className="update-btn">
    Update Profile
  </button>

</form>
        </div>

      </div>
    </div>
  );
}

export default StudentProfile;