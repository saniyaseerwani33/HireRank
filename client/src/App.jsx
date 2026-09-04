import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import RecruiterLogin from "./pages/RecruiterLogin";
import StudentRegister from "./pages/StudentRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentProfile from "./pages/StudentProfile";
import MyApplications from "./pages/MyApplications";
import RecruiterProfile from "./pages/RecruiterProfile";
import ResumeReport from "./pages/ResumeReport";
import JobMatch from "./pages/JobMatch";
import CandidateReport from "./pages/CandidateReport";
import RecommendedJobs from "./pages/RecommendedJobs";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/recruiter-register" element={<RecruiterRegister />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route
  path="/recruiter-dashboard"
  element={<RecruiterDashboard />}
/>
<Route path="/profile" element={<StudentProfile />} />
<Route path="/my-applications" element={<MyApplications />} />
<Route path="/recruiter-profile" element={<RecruiterProfile />} />
<Route path="/resume-report" element={<ResumeReport />} />
<Route path="/job-match" element={<JobMatch />} />
<Route
  path="/candidate-report"
  element={<CandidateReport />}
/>
<Route
  path="/recommended-jobs"
  element={<RecommendedJobs />}
/>
<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;