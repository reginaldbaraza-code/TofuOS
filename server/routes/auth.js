import { Router } from "express";
import { setToken, deleteToken } from "../store.js";
import { randomBytes } from "crypto";

const router = Router();

const DEMO_EMAIL = "demo@tofuos.dev";
const MIN_PASSWORD_LENGTH = 6;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function createToken() {
  return `tk_${randomBytes(24).toString("hex")}`;
}

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (normalizedEmail !== DEMO_EMAIL || !password || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(401).json({
      error: "Invalid email or password. Try demo@tofuos.dev with a password of 6+ characters.",
    });
  }
  const token = createToken();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  setToken(token, { userId: "demo-user", expiresAt });
  res.json({
    user: {
      id: "demo-user",
      email: normalizedEmail,
      displayName: "Demo User",
    },
    token,
    expiresAt,
  });
});

router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) deleteToken(token);
  res.status(204).end();
});

export default router;
