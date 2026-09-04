import express from "express";
import upload from "../middleware/upload.js";
import {
  registerStudent,
  loginStudent,
  uploadResume,
  updateStudentProfile,
  getStudentById,
  testEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.put(
  "/upload-resume/:id",
  upload.single("resume"),
  uploadResume
);
router.put("/update/:id", updateStudentProfile);
router.get("/:id", getStudentById);
router.post("/test-email", testEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
export default router;