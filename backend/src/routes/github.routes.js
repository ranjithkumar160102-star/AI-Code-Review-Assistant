import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { reviewGithubRepo } from "../controllers/github.controller.js";

const router = express.Router();

router.post("/review", protect, reviewGithubRepo);

export default router;