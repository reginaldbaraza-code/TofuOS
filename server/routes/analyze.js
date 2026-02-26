import { Router } from "express";
import OpenAI from "openai";
import { getSourcesForUser, getUploadPath } from "../store.js";
import { requireAuth } from "../middleware/auth.js";
import { extractTextFromFile } from "../lib/extractText.js";

const router = Router();
router.use(requireAuth);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const PM_SYSTEM_PROMPT = `You are an experienced project manager. Your task is to analyze the provided content (from documents, app reviews, or other sources) and produce a concise list of actionable insights.

Rules:
- Each insight should be one or two clear sentences.
- Focus on: risks, opportunities, user pain points, feature requests, quality issues, and actionable recommendations.
- Return ONLY a valid JSON object with exactly this shape: { "insights": string[] }
- No markdown, no code fences, no extra text—just the JSON.`;

/**
 * POST /api/analyze
 * Body: { sourceIds: string[] } — IDs of sources to analyze (selected by user)
 * Returns: { insights: string[] }
 */
router.post("/", async (req, res) => {
  const { sourceIds } = req.body || {};
  const userId = req.userId;

  if (!Array.isArray(sourceIds) || sourceIds.length === 0) {
    return res.status(400).json({ error: "sourceIds must be a non-empty array" });
  }

  if (!openai.apiKey) {
    return res.status(503).json({
      error: "AI analysis is not configured. Set OPENAI_API_KEY in the server environment.",
    });
  }

  const sources = getSourcesForUser(userId).filter((s) => sourceIds.includes(s.id));
  if (sources.length === 0) {
    return res.status(400).json({ error: "No valid sources found for the given IDs" });
  }

  const textParts = [];

  for (const source of sources) {
    if (source.type === "reviews" && source.meta?.url) {
      textParts.push(`[App reviews source: ${source.name}]\nURL: ${source.meta.url}\n(Use this context: app store reviews from the above URL. Provide insights a project manager would derive from typical app store feedback.)`);
    } else if ((source.type === "pdf" || source.type === "document") && source.meta?.fileId) {
      const filePath = getUploadPath(userId, source.meta.fileId);
      const text = await extractTextFromFile(filePath);
      if (text) {
        textParts.push(`[${source.name}]\n${text.slice(0, 120000)}`);
      } else {
        textParts.push(`[${source.name}]\n(No text could be extracted from this file.)`);
      }
    } else {
      textParts.push(`[${source.name}]\n(No content available for this source.)`);
    }
  }

  const combined = textParts.join("\n\n---\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: PM_SYSTEM_PROMPT },
        { role: "user", content: `Analyze the following content and return a JSON object with an "insights" array of strings.\n\n${combined}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() ?? "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { insights: [] };
    }
    const insights = Array.isArray(parsed.insights) ? parsed.insights : [];
    res.json({ insights });
  } catch (e) {
    console.error("OpenAI analyze error:", e.message);
    res.status(500).json({
      error: e.message || "AI analysis failed",
    });
  }
});

export default router;
