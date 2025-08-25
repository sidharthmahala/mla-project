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
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load courses</p>;
  }

  // ✅ Always default to [] if courses is undefined or not an array
  const safeCourses = Array.isArray(courses) ? courses : [];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {safeCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
