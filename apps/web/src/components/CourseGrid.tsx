// src/components/CourseGrid.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../lib/api";
import CourseCard from "./CourseCard";

export default function CourseGrid() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Failed to load courses</p>
      </div>
    );
  }


  const safeCourses = Array.isArray(courses) ? courses : [];

  return (
    <div className="flex items-center justify-center bg-gray-100 p-6 border rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {safeCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
