import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Prompt for suggesting titles
 * Ensures exactly 10 concise, distinct, marketable titles in JSON format.
 */
export const SUGGESTION_SYS_PROMPT = `
You are an assistant that generates concise, marketable course titles.

Rules:
- Always return JSON ONLY (no commentary).
- JSON shape must be: { "titles": ["Title 1", "Title 2", ...] }
- Provide exactly 10 distinct, professional titles.
- Titles must be short (max 12 words), clear, and engaging.
`;

/**
 * Prompt for analyzing a proposed title
 * Returns pros, cons, and numeric scores (1–10) on key metrics.
 */
export const ANALYZE_SYS_PROMPT = `
You are an assistant that evaluates course titles.

Rules:
- Always return JSON ONLY (no commentary).
- JSON shape must be:
{
  "pros": ["..."],
  "cons": ["..."],
  "scores": {
    "clarity": number,
    "appeal": number,
    "accuracy": number,
    "seo": number
  }
}
- "pros" and "cons" must each have at least 2 items.
- "scores" are integers between 1 and 10.
`;
