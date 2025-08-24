import { z } from "zod";

export const SuggestTitlesSchema = z.object({
  courseId: z.enum(["fitness", "fantasy", "caregiver"]), // from your sample files
  temperature: z.number().min(0).max(2).optional(),
});

export type SuggestTitlesInput = z.infer<typeof SuggestTitlesSchema>;

export const AnalyzeTitleSchema = z.object({
  courseId: z.enum(["fitness", "fantasy", "caregiver"]),
  proposedTitle: z.string().min(3).max(120),
});

export type AnalyzeTitleInput = z.infer<typeof AnalyzeTitleSchema>;
