import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function RecruiterRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  companyName: "",
  companyLocation: "",
  recruiterName: "",
  email: "",
  password: "",
  confirmPassword: "",
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
    const response = await API.post("/recruiters/register", {
  companyName: formData.companyName,
  companyLocation: formData.companyLocation,
  recruiterName: formData.recruiterName,
  email: formData.email,
  password: formData.password,
});

    toast.success(response.data.message);
    navigate("/recruiter-login");

    setFormData({
  companyName: "",
  companyLocation: "",
  recruiterName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Recruiter Registration</h2>
        <p>Create your recruiter account.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <input
  type="text"
  name="companyLocation"
  placeholder="Company Location"
  value={formData.companyLocation}
  onChange={handleChange}
/>

          <input
            type="text"
            name="recruiterName"
            placeholder="Recruiter Name"
            value={formData.recruiterName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Company Email"
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

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RecruiterRegister;