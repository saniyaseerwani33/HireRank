import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function StudentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  college: "",
  branch: "",
  graduationYear: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (Object.values(formData).includes("")) {
    alert("Please fill in all fields.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await API.post("/students/register", {
  fullName: formData.fullName,
  email: formData.email,
  password: formData.password,
  college: formData.college,
  branch: formData.branch,
  graduationYear: formData.graduationYear,
});

    toast.success(response.data.message);
    navigate("/student-login");

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      college: "",
      branch: "",
      graduationYear: "",
    });

  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Student Registration</h2>
        <p>Create your HireRank account.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <input
            type="text"
            name="college"
            placeholder="College Name"
            value={formData.college}
            onChange={handleChange}
          />

          <input
  type="text"
  name="branch"
  placeholder="Branch"
  value={formData.branch}
  onChange={handleChange}
/>

          <input
  type="number"
  name="graduationYear"
  placeholder="Graduation Year"
  value={formData.graduationYear}
  onChange={handleChange}
/>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default StudentRegister;