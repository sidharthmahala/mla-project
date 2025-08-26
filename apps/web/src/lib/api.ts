import axios from "axios";

export type Course = {
  id: number;
  title: string;
  selectedTitle: string | null;
  contentPath: string | null;
  coverUrl: string | null;
  description: string;
  price: string;
  chapters: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hosting: boolean;
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

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
});


// Fetch
export async function fetchCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[]>("/courses");
  if (!Array.isArray(data)) {
    throw new Error("Invalid courses response");
  }
  return data;
}

// Suggest new titles
export async function suggestTitles(
  courseId: number,
  temperature = 0.7
): Promise<string[]> {
  const { data } = await api.post<SuggestResponse>("/suggest-titles", {
    courseId,
    temperature,
  });
  return data.titles;
}

// Analyze title
export async function analyzeTitle(
  courseId: number,
  proposedTitle: string
): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>("/analyze-title", {
    courseId,
    proposedTitle,
  });
  return data;
}

// Update course title permanently in DB
export async function updateCourseTitle(
  courseId: number,
  title: string
): Promise<Course> {
  const { data } = await api.patch<Course>(`/courses/${courseId}`, { title });
  return data;
}
