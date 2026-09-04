import express from "express";
import {
  registerRecruiter,
  loginRecruiter,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);

export default router;