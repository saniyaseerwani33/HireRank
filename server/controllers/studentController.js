import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry in database
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await student.save();

    // Reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: student.email,
      subject: "HireRank Password Reset",
      message: `
        <h2>Password Reset Request</h2>

        <p>You requested to reset your HireRank password.</p>

        <p>
          <a href="${resetUrl}">
            Click here to reset your password
          </a>
        </p>

        <p>This link expires in <strong>15 minutes</strong>.</p>

        <p>If you didn't request this, simply ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset email sent successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        message: "Invalid or expired reset link.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    student.password = hashedPassword;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;

    await student.save();

    res.status(200).json({
      message: "Password reset successfully. Please login.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const testEmail = async (req, res) => {
  try {
    await sendEmail({
      email: req.body.email,
      subject: "HireRank Test Email",
      message: `
        <h2>🎉 Congratulations!</h2>
        <p>Your HireRank email service is working successfully.</p>
      `,
    });

    res.json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      college,
      branch,
      graduationYear,
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    // Create new student
    const hashedPassword = await bcrypt.hash(password, 10);

const student = await Student.create({
  fullName,
  email,
  password: hashedPassword,
  college,
  branch,
  graduationYear,
});

    res.status(201).json({
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "Student not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
  message: "Login successful",
  student: {
  _id: student._id,
  fullName: student.fullName,
  email: student.email,
  college: student.college,
  branch: student.branch,
  graduationYear: student.graduationYear,
  resume: student.resume,
},
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const uploadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Save resume filename
    student.resume = req.file.filename;
    await student.save();

    // Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const pdfPath = `uploads/${req.file.filename}`;
    const pdfBuffer = fs.readFileSync(pdfPath);

    const prompt = `
You are an ATS (Applicant Tracking System).

Analyze the uploaded resume.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use \`\`\`json.
Do NOT write any explanation.

Return exactly in this format:

{
  "candidateName": "",
  "contact": {
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "professionalSummary": "",
  "technicalSkills": [],
  "softSkills": [],
  "education": "",
  "experience": "",
  "projects": [],
  "certifications": [],
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "atsScore": 0,
  "suggestions": []
}
`;

const result = await model.generateContent([
  {
    inlineData: {
      data: pdfBuffer.toString("base64"),
      mimeType: "application/pdf",
    },
  },
  prompt,
]);

    const rawResponse = result.response.text();

console.log(rawResponse);

const cleanJson = rawResponse
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const analysis = JSON.parse(cleanJson);
student.aiAnalysis = analysis;

await student.save();

res.status(200).json({
  message: "Resume uploaded successfully",
  resume: student.resume,
  analysis,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { fullName, college, branch, graduationYear } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      {
        fullName,
        college,
        branch,
        graduationYear,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};