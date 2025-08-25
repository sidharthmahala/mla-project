import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseTitle } from "../lib/api";

export function useUpdateCourseTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, title }: { courseId: number; title: string }) =>
      updateCourseTitle(courseId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
