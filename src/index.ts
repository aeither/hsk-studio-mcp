#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = process.env.HSK_STUDIO_API_URL ?? "https://hsk.fulinlabs.com/api/agent";

async function call(path: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  const res = await fetch(url, { headers: { accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) {
    return { isError: true, content: [{ type: "text" as const, text: `HSK Studio API ${res.status}: ${text}` }] };
  }
  return { content: [{ type: "text" as const, text }] };
}

const server = new McpServer({ name: "hsk-studio", version: "0.1.0" }, {
  instructions:
    "Read-only HSK vocabulary, graded readings and level checks. Show the url field of a result to the learner so they can open HSK Studio.",
});

server.tool(
  "lookup_word",
  "Look up a Chinese word, pinyin or English word in the HSK Studio dictionary. Returns pinyin, meaning, HSK level and related words.",
  { query: z.string().min(1).describe("A Chinese word, a pinyin string or an English word") },
  async ({ query }) => call("word", { q: query }),
);

server.tool(
  "list_words_by_level",
  "List dictionary words of one HSK level (1 to 7; 7 is the HSK 7-9 band), in syllabus order.",
  {
    level: z.number().int().min(1).max(7),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async ({ level, limit, offset }) => call("words", { level, limit, offset }),
);

server.tool(
  "list_readings",
  "List the graded Chinese readings with their computed HSK level.",
  {},
  async () => call("readings"),
);

server.tool(
  "get_reading",
  "Get one graded reading: text, HSK level and the vocabulary in it. Ids come from list_readings.",
  { id: z.string().min(1) },
  async ({ id }) => call(`readings/${encodeURIComponent(id)}`),
);

server.tool(
  "check_text_level",
  "Estimate the HSK level of Chinese text (up to 5000 characters).",
  { text: z.string().min(1).max(5000) },
  async ({ text }) => call("level-check", { text }),
);

server.tool(
  "get_level_check_link",
  "Get the HSK Studio level check page link. Send learners there to check their own text and share the result.",
  {},
  async () => call("level-check-link"),
);

await server.connect(new StdioServerTransport());
