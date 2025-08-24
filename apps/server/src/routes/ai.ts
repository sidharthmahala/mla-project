import { Router } from "express";
import { openai, SUGGESTION_SYS_PROMPT, ANALYZE_SYS_PROMPT } from "../lib/openai";
import { compressContent, loadCourseContent } from "../lib/content";
import { SuggestTitlesSchema, AnalyzeTitleSchema } from "../schemas/ai";
import { formatZodError } from "./../utils/validationError"

const router = Router();

router.post("/suggest-titles", async (req, res) => {
  try {
    const parsed = SuggestTitlesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        issues: formatZodError(parsed.error),
      });
    }
    const { courseId, temperature } = parsed.data;

    const raw = loadCourseContent(courseId);
    const content = compressContent(raw);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: temperature ?? 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SUGGESTION_SYS_PROMPT },
        { role: "user", content: `CONTENT:\n${content}` },
      ],
    });

    let payload = completion.choices[0]?.message?.content ?? "{}";
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(payload);
    } catch {
      const match = payload.match(/\{[\s\S]*\}/);
      if (match) parsedResponse = JSON.parse(match[0]);
    }

    if (!parsedResponse || !Array.isArray(parsedResponse.titles)) {
      throw new Error("Malformed model response");
    }

    const unique = Array.from(new Set(parsedResponse.titles.map((t: string) => t.trim()))).slice(0, 10);
    return res.json({ titles: unique });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to suggest titles", detail: err.message });
  }
});

router.post("/analyze-title", async (req, res) => {
  try {
    const parsed = AnalyzeTitleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        issues: formatZodError(parsed.error),
      });
    }
    const { courseId, proposedTitle } = parsed.data;

    const raw = loadCourseContent(courseId);
    const content = compressContent(raw, 8000);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ANALYZE_SYS_PROMPT },
        { role: "user", content: `CONTENT:\n${content}\nTITLE:${proposedTitle}` },
      ],
    });

    let payload = completion.choices[0]?.message?.content ?? "{}";
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(payload);
    } catch {
      const match = payload.match(/\{[\s\S]*\}/);
      if (match) parsedResponse = JSON.parse(match[0]);
    }

    if (!parsedResponse || !parsedResponse.scores) {
      throw new Error("Malformed model response");
    }

    return res.json(parsedResponse);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to analyze title", detail: err.message });
  }
});

export default router;
