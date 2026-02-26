import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

/**
 * Extract plain text from a document file for AI analysis.
 * Returns a string or empty string on failure.
 */
export async function extractTextFromFile(filePath) {
  if (!fs.existsSync(filePath)) return "";
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === ".pdf") {
      const pdfParse = require("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data?.text?.trim() ?? "";
    }
    if (ext === ".docx" || ext === ".doc") {
      const mammoth = await import("mammoth");
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result?.value?.trim() ?? "";
    }
    if (ext === ".xlsx" || ext === ".xls") {
      const XLSX = (await import("xlsx")).default;
      const workbook = XLSX.readFile(filePath);
      const parts = [];
      workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name];
        const text = XLSX.utils.sheet_to_csv(sheet);
        if (text) parts.push(`[Sheet: ${name}]\n${text}`);
      });
      return parts.join("\n\n").trim();
    }
  } catch (e) {
    console.warn("extractTextFromFile error:", filePath, e.message);
  }
  return "";
}
