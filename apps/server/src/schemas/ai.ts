import { z } from "zod";

export const SuggestTitlesSchema = z.object({
  courseId: z.number(), // now always a number
  temperature: z.number().min(0).max(1).optional(),
});

export const AnalyzeTitleSchema = z.object({
  courseId: z.number(), // now always a number
  proposedTitle: z.string().min(3),
});
