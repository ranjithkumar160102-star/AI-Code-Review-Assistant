import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { reviewGithubRepository } from "../controllers/github.controller.js";

const router = express.Router();

router.post("/review", protect, reviewGithubRepository);

export default router;