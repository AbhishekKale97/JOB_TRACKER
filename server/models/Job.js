import mongoose from "mongoose";

// ── Valid status values — must match frontend Kanban columns ──────────────────
export const JOB_STATUSES = ["applied", "screening", "interview", "offer", "rejected"];
export const JOB_PRIORITIES = ["low", "medium", "high"];

const jobSchema = new mongoose.Schema(
  {
    // ── Ownership ──────────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job must belong to a user"],
      index: true, // speeds up "get all jobs for user" queries
    },

    // ── Core Fields ────────────────────────────────────────────────────────────
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: {
        values: JOB_STATUSES,
        message: "Status must be one of: applied, screening, interview, offer, rejected",
      },
      default: "applied",
    },

    // ── Optional Details ──────────────────────────────────────────────────────
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: "",
    },
    salary: {
      type: String,
      trim: true,
      maxlength: [50, "Salary field cannot exceed 50 characters"],
      default: "",
    },
    url: {
      type: String,
      trim: true,
      maxlength: [500, "URL cannot exceed 500 characters"],
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
      default: "",
    },
    priority: {
      type: String,
      enum: {
        values: JOB_PRIORITIES,
        message: "Priority must be one of: low, medium, high",
      },
      default: "medium",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Compound Index: fast lookup for sorted user job lists ─────────────────────
jobSchema.index({ user: 1, createdAt: -1 });

// ── Virtual: formatted applied date ──────────────────────────────────────────
jobSchema.virtual("appliedDateFormatted").get(function () {
  if (!this.appliedDate) return "";
  return this.appliedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});

const Job = mongoose.model("Job", jobSchema);

export default Job;