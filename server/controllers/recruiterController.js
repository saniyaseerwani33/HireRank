import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcryptjs";

export const registerRecruiter = async (req, res) => {
  try {
    const {
      companyName,
      recruiterName,
      email,
      password,
      companyLocation,
    } = req.body;

    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingRecruiter) {
      return res.status(400).json({
        message: "Recruiter already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create recruiter
    const recruiter = await Recruiter.create({
      companyName,
      recruiterName,
      email,
      password: hashedPassword,
      companyLocation,
    });

    res.status(201).json({
      message: "Recruiter registered successfully",
      recruiter,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if recruiter exists
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(400).json({
        message: "Recruiter not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      recruiter: {
        companyName: recruiter.companyName,
        recruiterName: recruiter.recruiterName,
        email: recruiter.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};