import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

// ── Helper: sign a JWT for a user ID ─────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Helper: send token + user in response ────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
};

// ── Helper: extract validation errors from express-validator ──────────────────
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return the first error message for a clean UX
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

/**
 * @route   POST /api/auth/register
 * @access  Public
 * @desc    Create a new user account and return a JWT
 */
export const register = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { name, email, password } = req.body;

  try {
    // ── Check if email already exists ────────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // ── Create user (password hashing handled in pre-save hook) ──────────────
    const user = await User.create({ name, email, password });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Register error:", error);

    // Handle Mongoose duplicate key error (race condition fallback)
    if (error.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Authenticate user and return JWT
 */
export const login = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { email, password } = req.body;

  try {
    // ── Find user — explicitly select password (it's excluded by default) ────
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      // use a generic message — don't reveal whether email exists
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * @route   GET /api/auth/me
 * @access  Protected
 * @desc    Return the current logged-in user's profile
 */
export const getMe = async (req, res) => {
  // req.user is already attached by the protect middleware
  res.status(200).json({
    success: true,
    user: req.user.toSafeObject(),
  });
};