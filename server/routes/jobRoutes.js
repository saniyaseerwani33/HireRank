import express from "express";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/create", createJob);
router.get("/", getAllJobs);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);

export default router;