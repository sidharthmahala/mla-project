// src/components/TitleModal/TitleRow.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight } from "lucide-react";

type Props = {
  title: string;
  index: number;
  selectedIndex: number | null;
  mode: "loading" | "titles" | "report";
  isPending: boolean; // updateCourseTitle pending
  onUseTitle: (title: string) => void;
  onAnalyze: (title: string, index: number) => void;
  analyze: { isPending?: boolean }; // from useAnalyzeTitle()
  toggleCompareSelection: (title: string) => void;
  selectedForCompare: string[];
  onToggle: (nextIndex: number | null) => void; // ⬅️ added
};

export default function TitleRow({
  title,
  index,
  selectedIndex,
  mode,
  isPending,
  onUseTitle,
  onAnalyze,
  analyze,
  toggleCompareSelection,
  selectedForCompare,
  onToggle,
}: Props) {
  const expanded = selectedIndex === index && mode !== "report";
  const isSelected = selectedForCompare.includes(title);

  return (
    <div
      className={`rounded-lg border bg-white p-3 hover:shadow-sm transition ${
        isSelected ? "border-indigo-400 bg-indigo-50" : "border-gray-100"
      }`}
    >
      <button
        onClick={() => onToggle(expanded ? null : index)} 
        className="w-full flex items-center justify-between text-left text-sm"
      >
        <span className="font-medium">{title}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onUseTitle(title)}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-black transition disabled:opacity-70"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Use this Title"}
              </button>

              <button
                onClick={() => onAnalyze(title, index)}
                disabled={!!analyze?.isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
              >
                {analyze?.isPending && selectedIndex === index ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Run Performance Report"
                )}
              </button>

              <button
                onClick={() => toggleCompareSelection(title)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isSelected ? "Remove from Compare" : "Add to Compare"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
