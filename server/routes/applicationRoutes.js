import express from "express";
import {
  applyForJob,
  getAllApplications,
  getStudentApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply", applyForJob);
router.get("/", getAllApplications);
router.get("/student/:email", getStudentApplications);
router.put("/:id", updateApplicationStatus);

export default router;