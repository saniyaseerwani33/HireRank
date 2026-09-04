import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";

export const applyForJob = async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      jobId,
      companyName,
      jobTitle,
    } = req.body;

    const student = await Student.findOne({ email: studentEmail });

if (!student) {
  return res.status(404).json({
    message: "Student not found",
  });
}

    const application = await Application.create({
  studentName,
  studentEmail,
  resume: student.resume,
  aiAnalysis: student.aiAnalysis,
  jobId,
  companyName,
  jobTitle,
});

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { recruiterEmail } = req.query;

    // Find jobs posted by this recruiter
    const jobs = await Job.find({ recruiterEmail });

    const jobIds = jobs.map((job) => job._id);

    // Applications for recruiter's jobs
    const applications = await Application.find({
      jobId: { $in: jobIds },
    }).sort({ createdAt: -1 });

    // Attach AI analysis of each student
    const applicationsWithAI = await Promise.all(
      applications.map(async (application) => {
        const student = await Student.findOne({
          email: application.studentEmail,
        });

        return {
          ...application.toObject(),
          aiAnalysis: student?.aiAnalysis || null,
        };
      })
    );
    applicationsWithAI.sort((a, b) => {
  const scoreA = a.aiAnalysis?.atsScore || 0;
  const scoreB = b.aiAnalysis?.atsScore || 0;

  return scoreB - scoreA;
});
    res.status(200).json(applicationsWithAI);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const { email } = req.params;

    const applications = await Application.find({
      studentEmail: email,
    }).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};