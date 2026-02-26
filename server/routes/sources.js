import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {
  getSourcesForUser,
  saveSourcesForUser,
  ensureUserUploadDir,
  getUploadPath,
} from "../store.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensureUserUploadDir(req.userId);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || path.extname(file.originalname.toLowerCase());
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${uuidv4()}_${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || "").toLowerCase();
    const allowed =
      [".pdf", ".doc", ".docx", ".xls", ".xlsx"].includes(ext) || ALLOWED_MIMES.includes(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error("Invalid file type. Use Word, PDF, or Excel."));
  },
});

// GET /api/sources — list sources for current user
router.get("/", (req, res) => {
  const sources = getSourcesForUser(req.userId);
  res.json(sources);
});

// PATCH /api/sources — replace all sources (for toggle selected, reorder, etc.)
router.patch("/", (req, res) => {
  const body = req.body;
  const sources = Array.isArray(body) ? body : body.sources;
  if (!Array.isArray(sources)) {
    return res.status(400).json({ error: "sources must be an array" });
  }
  const saved = saveSourcesForUser(req.userId, sources);
  res.json(saved);
});

// POST /api/sources/reviews — add one reviews source
router.post("/reviews", (req, res) => {
  const { store, appPageUrl } = req.body || {};
  if (!appPageUrl || typeof appPageUrl !== "string") {
    return res.status(400).json({ error: "appPageUrl is required" });
  }
  const name = store === "apple" ? "App Store reviews" : "Play Store reviews";
  const source = {
    id: `reviews-${Date.now()}`,
    name,
    type: "reviews",
    selected: true,
    meta: { store: store === "apple" ? "apple" : "play", url: appPageUrl },
  };
  const sources = getSourcesForUser(req.userId);
  sources.push(source);
  saveSourcesForUser(req.userId, sources);
  res.status(201).json(source);
});

// POST /api/sources/documents — upload files and add document sources
router.post("/documents", upload.array("files", 20), (req, res) => {
  const files = req.files || [];
  const sources = getSourcesForUser(req.userId);
  const added = files.map((file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const type = ext === ".pdf" ? "pdf" : "document";
    const source = {
      id: `doc-${Date.now()}-${uuidv4().slice(0, 8)}`,
      name: file.originalname,
      type,
      selected: true,
      meta: { fileId: file.filename },
    };
    sources.push(source);
    return source;
  });
  saveSourcesForUser(req.userId, sources);
  res.status(201).json(added);
});

export default router;
