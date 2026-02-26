import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import sourcesRoutes from "./routes/sources.js";
import analyzeRoutes from "./routes/analyze.js";
import jiraRoutes from "./routes/jira.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sources", sourcesRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/jira", jiraRoutes);

// Serve uploaded files (optional: so frontend can show links)
app.get("/api/uploads/:userId/:fileId", (req, res) => {
  const { userId, fileId } = req.params;
  if (!/^[a-z0-9-]+$/.test(userId) || fileId.includes("..")) return res.status(400).end();
  const uploadsPath = path.join(__dirname, "..", "data", "uploads", userId, fileId);
  if (!fs.existsSync(uploadsPath)) return res.status(404).end();
  res.sendFile(path.resolve(uploadsPath));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
