import { Router } from "express";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import {
  getJobs,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";

const router = Router();

// ── All job routes are protected ──────────────────────────────────────────────
router.use(protect);

// ── Validation Rule Sets ──────────────────────────────────────────────────────

const jobBodyRules = [
  body("company")
    .trim()
    .notEmpty().withMessage("Company name is required")
    .isLength({ max: 100 }).withMessage("Company name cannot exceed 100 characters"),

  body("role")
    .trim()
    .notEmpty().withMessage("Job role is required")
    .isLength({ max: 100 }).withMessage("Role cannot exceed 100 characters"),

  body("status")
    .optional()
    .isIn(["applied", "screening", "interview", "offer", "rejected"])
    .withMessage("Invalid status value"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("url")
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage("Job URL must be a valid URL (include https://)"),

  body("notes")
    .optional()
    .isLength({ max: 2000 }).withMessage("Notes cannot exceed 2000 characters"),

  body("appliedDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Applied date must be a valid date"),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// IMPORTANT: /stats must come BEFORE /:id — Express matches routes top-down.
// If /:id is first, the string "stats" would be treated as a MongoDB ObjectId.
router.get("/stats", getJobStats);

router.route("/")
  .get(getJobs)
  .post(jobBodyRules, createJob);

router.route("/:id")
  .get(getJobById)
  .put(jobBodyRules, updateJob)
  .delete(deleteJob);

router.patch("/:id/status", updateJobStatus);

export default router;