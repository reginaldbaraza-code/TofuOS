import { Router } from "express";
import { getJiraConfig, setJiraConfig, getJiraCredentials } from "../store.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/jira/config — get masked config (for "is configured" and domain)
router.get("/config", requireAuth, (req, res) => {
  const config = getJiraConfig(req.userId);
  res.json(config || { configured: false });
});

// POST /api/jira/config — save Jira credentials (domain, email, apiToken)
router.post("/config", requireAuth, (req, res) => {
  const { domain, email, apiToken } = req.body || {};
  const d = (domain || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!d || !email?.trim() || !apiToken?.trim()) {
    return res.status(400).json({ error: "domain, email, and apiToken are required" });
  }
  setJiraConfig(req.userId, {
    domain: d,
    email: email.trim(),
    apiToken: apiToken.trim(),
  });
  res.json({ configured: true, domain: d });
});

// POST /api/jira/create-issue — create a Jira issue (summary = insight text)
router.post("/create-issue", requireAuth, async (req, res) => {
  const creds = getJiraCredentials(req.userId);
  if (!creds) {
    return res.status(400).json({ error: "Jira is not configured. Set your Jira credentials first." });
  }

  const { summary, description, projectKey, issueType } = req.body || {};
  const title = (summary || "").trim();
  if (!title) {
    return res.status(400).json({ error: "summary is required" });
  }

  const project = (projectKey || "").trim() || "PROJ";
  const type = (issueType || "").trim() || "Task";
  const desc = (description || "").trim() || title;

  const baseUrl = `https://${creds.domain}/rest/api/3`;
  const auth = Buffer.from(`${creds.email}:${creds.apiToken}`).toString("base64");

  const body = {
    fields: {
      project: { key: project },
      summary: title.slice(0, 255),
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: desc }],
          },
        ],
      },
      issuetype: { name: type },
    },
  };

  try {
    const r = await fetch(`${baseUrl}/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      const msg = data?.errorMessages?.join(" ") || data?.errors?.summary || r.statusText;
      return res.status(r.status >= 400 ? r.status : 500).json({
        error: msg || "Failed to create Jira issue",
      });
    }

    res.json({
      key: data.key,
      id: data.id,
      url: `https://${creds.domain}/browse/${data.key}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || "Request to Jira failed" });
  }
});

export default router;
