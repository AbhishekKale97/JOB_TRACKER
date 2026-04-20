import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect — Express middleware that validates a Bearer JWT.
 *
 * On success  → attaches req.user (without password) and calls next().
 * On failure  → returns 401 JSON with a descriptive message.
 *
 * Usage: router.get("/me", protect, getMe)
 */
const protect = async (req, res, next) => {
  let token;

  // ── 1. Extract token from Authorization header ──────────────────────────────
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorised — no token provided" });
  }

  // ── 2. Verify the token ────────────────────────────────────────────────────
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired — please log in again" });
    }
    return res.status(401).json({ message: "Invalid token — please log in again" });
  }

  // ── 3. Fetch the user from DB (ensures user still exists) ─────────────────
  try {
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User belonging to this token no longer exists" });
    }

    req.user = user; // attach to request for downstream use
    next();
  } catch (error) {
    console.error("Auth middleware DB error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

export default protect;