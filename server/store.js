import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const TOKENS_PATH = path.join(DATA_DIR, "tokens.json");
const SOURCES_PATH = path.join(DATA_DIR, "sources.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readJson(filePath, defaultValue = {}) {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === "ENOENT") return defaultValue;
    throw e;
  }
}

function writeJson(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Tokens: { [token]: { userId, expiresAt } }
export function getTokens() {
  return readJson(TOKENS_PATH, {});
}

export function setToken(token, { userId, expiresAt }) {
  const tokens = getTokens();
  tokens[token] = { userId, expiresAt };
  writeJson(TOKENS_PATH, tokens);
}

export function deleteToken(token) {
  const tokens = getTokens();
  delete tokens[token];
  writeJson(TOKENS_PATH, tokens);
}

export function getUserIdByToken(token) {
  if (!token) return null;
  const tokens = getTokens();
  const entry = tokens[token];
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    delete tokens[token];
    writeJson(TOKENS_PATH, tokens);
    return null;
  }
  return entry.userId;
}

// Sources: { [userId]: Source[] }
export function getSourcesForUser(userId) {
  const all = readJson(SOURCES_PATH, {});
  return Array.isArray(all[userId]) ? all[userId] : [];
}

export function saveSourcesForUser(userId, sources) {
  const all = readJson(SOURCES_PATH, {});
  all[userId] = sources;
  writeJson(SOURCES_PATH, all);
  return all[userId];
}

export function ensureUserUploadDir(userId) {
  const dir = path.join(UPLOADS_DIR, userId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getUploadPath(userId, filename) {
  return path.join(UPLOADS_DIR, userId, filename);
}

// Jira config per user: { [userId]: { domain, email, apiToken } }
const JIRA_CONFIG_PATH = path.join(DATA_DIR, "jira.json");

export function getJiraConfig(userId) {
  const all = readJson(JIRA_CONFIG_PATH, {});
  const c = all[userId];
  if (!c) return null;
  return {
    domain: c.domain,
    email: c.email,
    // Don't expose full token to client; only indicate if configured
    hasToken: !!c.apiToken,
  };
}

export function setJiraConfig(userId, { domain, email, apiToken }) {
  const all = readJson(JIRA_CONFIG_PATH, {});
  all[userId] = { domain, email, apiToken };
  writeJson(JIRA_CONFIG_PATH, all);
  return getJiraConfig(userId);
}

export function getJiraCredentials(userId) {
  const all = readJson(JIRA_CONFIG_PATH, {});
  const c = all[userId];
  return c?.apiToken ? { domain: c.domain, email: c.email, apiToken: c.apiToken } : null;
}
