import axios from "axios";

/* ===== Types ===== */
export type Course = {
  id: number;
  title: string;
  contentPath: string | null;
  coverUrl: string | null;
  selectedTitle: string | null;
};

export type SuggestResponse = {
  titles: string[];
};

export type AnalyzeResponse = {
  pros: string[];
  cons: string[];
  scores: {
    clarity: number;
    appeal: number;
    accuracy: number;
    seo: number;
  };
};

/* ===== Axios client ===== */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
});

/* ===== API calls ===== */

// Suggest new titles for a course
export async function suggestTitles(
  courseId: number,
  temperature = 0.7
): Promise<string[]> {
  const { data } = await api.post<SuggestResponse>("/suggest-titles", {
    courseId,
    temperature,
  });
  return data.titles; // ✅ always array of strings
}

// Analyze a proposed title
export async function analyzeTitle(
  courseId: number,
  proposedTitle: string
): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>("/analyze-title", {
    courseId,
    proposedTitle,
  });
  return data; // ✅ { pros, cons, scores }
}

// Mark a title as the one in use
export async function useThisTitle(
  courseId: number,
  selectedTitle: string
): Promise<Course> {
  const { data } = await api.patch<{ course: Course }>(
    `/courses/${courseId}`,
    { selectedTitle }
  );
  return data.course;
}

export async function fetchCourses() {
  const { data } = await api.get<Course[]>("/courses");
  if (!Array.isArray(data)) {
    throw new Error("Invalid courses response");
  }
  return data;
}

