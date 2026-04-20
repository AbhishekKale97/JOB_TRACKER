import { validationResult } from "express-validator";
import Job, { JOB_STATUSES } from "../models/Job.js";

// ── Helper: extract validation errors ────────────────────────────────────────
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// ── Helper: verify job exists AND belongs to the requesting user ──────────────
const findOwnedJob = async (jobId, userId, res) => {
  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return null;
  }

  if (job.user.toString() !== userId.toString()) {
    res.status(403).json({ message: "Not authorised to access this job" });
    return null;
  }

  return job;
};

/**
 * @route   GET /api/jobs
 * @access  Protected
 * @desc    Get all jobs for the logged-in user, sorted newest first
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getJobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * @route   GET /api/jobs/stats
 * @access  Protected
 * @desc    Get application count grouped by status
 *
 * IMPORTANT: This route must be defined BEFORE /:id to avoid "stats"
 * being treated as a MongoDB ObjectId.
 */
export const getJobStats = async (req, res) => {
  try {
    const result = await Job.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Build a complete stats object with 0 defaults for missing statuses
    const stats = JOB_STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    result.forEach(({ _id, count }) => {
      stats[_id] = count;
    });

    stats.total = Object.values(stats).reduce((sum, n) => sum + n, 0);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("getJobStats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/**
 * @route   GET /api/jobs/:id
 * @access  Protected
 * @desc    Get a single job by ID (must belong to user)
 */
export const getJobById = async (req, res) => {
  try {
    const job = await findOwnedJob(req.params.id, req.user._id, res);
    if (!job) return;

    res.status(200).json({ success: true, job });
  } catch (error) {
    // Mongoose invalid ObjectId
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("getJobById error:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

/**
 * @route   POST /api/jobs
 * @access  Protected
 * @desc    Create a new job application
 */
export const createJob = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { company, role, status, location, salary, url, notes, priority, appliedDate } = req.body;

  try {
    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status,
      location,
      salary,
      url,
      notes,
      priority,
      appliedDate,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
};

/**
 * @route   PUT /api/jobs/:id
 * @access  Protected
 * @desc    Full update — replace all editable fields
 */
export const updateJob = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    let job = await findOwnedJob(req.params.id, req.user._id, res);
    if (!job) return;

    const allowedFields = ["company", "role", "status", "location", "salary", "url", "notes", "priority", "appliedDate"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save(); // triggers Mongoose validators

    res.status(200).json({ success: true, job });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("updateJob error:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

/**
 * @route   PATCH /api/jobs/:id/status
 * @access  Protected
 * @desc    Lightweight status-only update — used by Kanban drag-and-drop
 */
export const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !JOB_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${JOB_STATUSES.join(", ")}`,
    });
  }

  try {
    let job = await findOwnedJob(req.params.id, req.user._id, res);
    if (!job) return;

    job.status = status;
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("updateJobStatus error:", error);
    res.status(500).json({ message: "Failed to update job status" });
  }
};

/**
 * @route   DELETE /api/jobs/:id
 * @access  Protected
 * @desc    Delete a job application permanently
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await findOwnedJob(req.params.id, req.user._id, res);
    if (!job) return;

    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("deleteJob error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};