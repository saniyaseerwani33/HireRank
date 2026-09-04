import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    recruiterName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    companyLocation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

export default Recruiter;