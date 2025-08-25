// src/components/CourseCard.tsx
import { useState } from "react";
import TitleModal from "./TitleModal";

type Course = {
  id: number;
  title: string;
  coverUrl?: string | null;
};


type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [chosenTitle, setChosenTitle] = useState<string | null>(null);

  return (
    <div className="rounded-xl border bg-white shadow hover:shadow-md transition p-4">
      {/* Cover image */}
      {course.coverUrl && (
        <img
          src={course.coverUrl}
          alt={course.title}
          className="mb-3 h-40 w-full rounded-lg object-cover"
        />
      )}

      {/* Title */}
      <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
        {chosenTitle ?? course.title}
      </h2>

      {/* Actions */}
      <button
        className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={() => setModalOpen(true)}
      >
        Generate Suggestions
      </button>

      {/* Modal */}
      <TitleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courseId={course.id}
        onUseTitle={(title) => {
          setChosenTitle(title);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
