import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: {
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

    college: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    resume: {
  type: String,
  default: "",
},

aiAnalysis: {
  type: Object,
  default: null,
},

resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},

  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;