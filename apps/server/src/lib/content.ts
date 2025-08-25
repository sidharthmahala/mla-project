import fs from "node:fs";
import path from "node:path";
import { Course } from "../db/models/Course";

/**
 * Load the course content from the filesystem,
 * using the DB `contentPath` field.
 */
export async function loadCourseContent(course: Course): Promise<string> {
  if (!course.contentPath) {
    console.warn(`⚠ Course ${course.id} has no contentPath`);
    return ""; // or throw new Error("No content available")
  }

  const filePath = path.join(process.cwd(), course.contentPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ Missing file at ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf-8");
}
/**
 * Compress raw text by stripping tags/extra whitespace
 * and trimming to `maxChars`.
 */
export function compressContent(raw: string, maxChars = 12000): string {
  const noTags = raw.replace(/<[^>]+>/g, " ");
  const normalized = noTags.replace(/\s+/g, " ").trim();
  return normalized.length <= maxChars ? normalized : normalized.slice(0, maxChars) + "…";
}
