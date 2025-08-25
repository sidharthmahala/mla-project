import { useMutation } from "@tanstack/react-query";
import { suggestTitles, analyzeTitle } from "../lib/api";

/**
 * Suggest titles for a course
 */
export function useSuggestTitles() {
  return useMutation({
    mutationFn: ({ courseId, temperature }: { courseId: number; temperature?: number }) =>
      suggestTitles(courseId, temperature),
  });
}

export function useAnalyzeTitle() {
  return useMutation({
    mutationFn: ({ courseId, proposedTitle }: { courseId: number; proposedTitle: string }) =>
      analyzeTitle(courseId, proposedTitle),
  });
}
