// apps/server/src/routes/ai.ts
import { Router } from "express";
import fs from "fs/promises";
import { Course } from "../db/models/Course";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const router = Router();
const client = new OpenAI();

/* ========= SCHEMAS ========= */
const SuggestionsSchema = z.object({
  titles: z.array(z.string()),
});

const AnalysisSchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  scores: z.object({
    clarity: z.number(),
    appeal: z.number(),
    accuracy: z.number(),
    seo: z.number(),
  }),
});

/* ========= /suggest-titles ========= */
router.post("/suggest-titles", async (req, res) => {
  try {
    const { courseId, temperature } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Read file content if it exists
    let fileContent = "";
    if (course.contentPath) {
      try {
        fileContent = await fs.readFile(course.contentPath, "utf-8");
        // Limit to first 4000 characters to avoid exceeding context window
        if (fileContent.length > 4000) {
          fileContent = fileContent.slice(0, 4000) + "\n...[truncated]";
        }
      } catch {
        console.warn(`⚠ Could not read file: ${course.contentPath}`);
      }
    }

    // OpenAI call
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a course title generator. Generate exactly 10 alternative course titles for the user. The response MUST be a JSON object with a single key, 'titles', which is an array of strings. Do not include any other text, explanations, or code blocks. Just the JSON object.",
        },
        {
          role: "user",
          content: `Current Title: ${course.title}\n\nCourse Description: ${course.description}\n\nSample Content:\n${fileContent}`,
        },
      ],
      temperature: temperature ?? 0.6,
    });
    
    const outputText = response.choices[0].message.content;
    if (!outputText) {
      return res.status(500).json({ error: "No response generated from AI" });
    }

    const { titles } = JSON.parse(outputText);

    // Optional: Zod validation
    SuggestionsSchema.parse({ titles });

    if (!Array.isArray(titles) || titles.length === 0) {
      return res.status(500).json({ error: "No suggestions generated or invalid format" });
    }

    res.json({ titles });

  } catch (err: any) {
    console.error("❌ Suggest titles failed:", err.message, err.stack);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/* ========= /analyze-title ========= */
router.post("/analyze-title", async (req, res) => {
  try {
    const { courseId, proposedTitle } = req.body;

    if (!courseId || !proposedTitle) {
      return res
        .status(400)
        .json({ error: "courseId and proposedTitle are required" });
    }

    // Fetch course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Read file content if it exists
    let fileContent = "";
    if (course.contentPath) {
      try {
        fileContent = await fs.readFile(course.contentPath, "utf-8");
        // Limit to first 4000 characters to avoid exceeding context window
        if (fileContent.length > 4000) {
          fileContent = fileContent.slice(0, 4000) + "\n...[truncated]";
        }
      } catch {
        console.warn(`⚠ Could not read file: ${course.contentPath}`);
      }
    }

    // Ask OpenAI to analyze the proposed title
    const response = await client.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a course title evaluator. Analyze the given proposed title in terms of clarity, appeal, accuracy to course content, and SEO potential.",
        },
        {
          role: "user",
          content: `Current Title: ${course.title}\n\nCourse Content:\n${fileContent}\n\nProposed Title: ${proposedTitle}\n\nProvide pros, cons, and numeric scores (0–10) for clarity, appeal, accuracy, and seo.`,
        },
      ],
      temperature: 0.3,
      text: {
        format: zodTextFormat(AnalysisSchema, "title_analysis"),
      },
    });

    const parsed = response.output_parsed;
    if (!parsed) {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json(parsed);
  } catch (err: any) {
    console.error("❌ Analyze title failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;