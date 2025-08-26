// src/components/CourseCard.tsx
import { useState } from "react";
import { BookOpen, Clock, DollarSign } from "lucide-react";
import TitleModal from "./TitleModal";

type Course = {
  id: number;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  chapters?: number | null;
  duration?: string | null;
  level?: "Beginner" | "Intermediate" | "Advanced" | null;
  hosting?: boolean | null;
  price?: string | null;
};

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [chosenTitle, setChosenTitle] = useState<string | null>(null);

  const isFree = !course.price || course.price === "0";
  const numericPrice = Number(course.price) || null;
  const displayPrice = isFree ? "Free" : `${course.price}`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-4 border-white
                 shadow-md transition hover:shadow-xl group">
      {/* Cover */}
      {course.coverUrl && (
        <img
          src={course.coverUrl}
          alt={course.title}
          className="w-full aspect-[210/297] object-cover"
        />
      )}
      <div
        className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 
                    text-xs font-medium rounded-md shadow
                    ${
                      isFree
                        ? "bg-green-100 text-green-700"
                        : "bg-white/80 text-gray-900"
                    }`}
      >
        {!isFree && numericPrice !== null && <DollarSign className="w-3 h-3" />}
        {displayPrice}
      </div>
      {/* Overlay content */}
      <div className="absolute bottom-0 w-full z-20">
        {/* Chapters badge */}
        {course.chapters && (
          <div
            className="absolute -top-8 left-3 flex items-center gap-1 px-2 py-1 
                        text-xs font-medium rounded-lg bg-white/80 shadow"
          >
            <BookOpen className="w-3 h-3" />
            {course.chapters} Chapters
          </div>
        )}

        <div
          className="p-4 rounded-t-xl bg-white/50 backdrop-blur-md
                     transition-colors duration-700 ease-in-out group-hover:bg-white"
        >
          <header>
            <h2 className="text-lg font-semibold text-gray-900">
              {chosenTitle ?? course.title}
            </h2>
            {course.description && (
              <p className="text-sm text-gray-700 line-clamp-2">
                {course.description}
              </p>
            )}
          </header>

          {/* Footer (badges row + button) */}
          <footer className="flex flex-col gap-3 mt-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {course.duration && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
              )}
              {course.level && (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {course.level}
                </span>
              )}
              {course.hosting && (
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">
                  Hosted
                </span>
              )}
            </div>

            {/* Suggest button */}
            <button
              onClick={() => setModalOpen(true)}
              aria-label="Suggest new titles for this course"
              className="px-4 py-2 text-sm font-medium border border-gray-400
                         rounded-2xl shadow-sm bg-white text-gray-900
                         hover:bg-gray-100 transition cursor-pointer"
            >
              Suggest New Titles
            </button>
          </footer>
        </div>
      </div>

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
