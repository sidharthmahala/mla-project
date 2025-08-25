// src/components/TitleModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSuggestTitles, useAnalyzeTitle } from "../hooks/useAI";
import { useUpdateCourseTitle } from "../hooks/useCourses";

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  onUseTitle: (title: string) => void;
};

type Mode = "loading" | "titles" | "report";

export default function TitleModal({
  open,
  onClose,
  courseId,
  onUseTitle,
}: Props) {
  const suggest = useSuggestTitles();
  const analyze = useAnalyzeTitle();

  const [temperature, setTemperature] = useState(0.6);
  const [mode, setMode] = useState<Mode>("loading");
  const [titleBatches, setTitleBatches] = useState<string[][]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Fetch suggestions on open
  useEffect(() => {
    if (open) {
      setMode("loading");
      setSelectedIndex(null);
      suggest.mutate(
        { courseId, temperature: 0.6 },
        {
          onSuccess: (data) => {
            setTitleBatches([data]);
            setBatchIndex(0);
            setMode("titles");
          },
        }
      );
    }
  }, [open, courseId]);

  async function handleSeeMore() {
    const newTemp = Math.min(1, temperature + 0.2);
    setTemperature(newTemp);
    setMode("loading");
    setSelectedIndex(null);

    suggest.mutate(
      { courseId, temperature: newTemp },
      {
        onSuccess: (data) => {
          setTitleBatches((prev) => [...prev, data]);
          setBatchIndex((prev) => prev + 1);
          setMode("titles");
        },
      }
    );
  }

  const updateCourseTitle = useUpdateCourseTitle();

  function handleUseTitle(title: string) {
    updateCourseTitle.mutate({ courseId, title });
    onUseTitle(title);
  }

  function handleBack() {
    if (batchIndex > 0) {
      setBatchIndex((prev) => prev - 1);
      setMode("titles");
    }
  }

  async function handleAnalyze(title: string, index: number) {
    setSelectedIndex(index);
    setMode("loading");
    analyze.mutate(
      { courseId, proposedTitle: title },
      {
        onSuccess: () => setMode("report"),
      }
    );
  }

  function TitleRow({ title, index }: { title: string; index: number }) {
    const expanded = selectedIndex === index && mode !== "report";
    return (
      <div className="rounded-lg border border-gray-50 bg-white p-3 hover:shadow-sm hover:border-gray-200 transition">
        <button
          onClick={() => setSelectedIndex(expanded ? null : index)}
          className="w-full flex items-center justify-between text-left text-sm"
        >
          <span className="font-medium">{title}</span>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
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
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleUseTitle(title)}
                  disabled={updateCourseTitle.isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-black transition disabled:opacity-70"
                >
                  {updateCourseTitle.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Use this Title"
                  )}
                </button>
                <button
                  onClick={() => handleAnalyze(title, index)}
                  disabled={analyze.isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                >
                  {analyze.isPending && selectedIndex === index ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Run Performance Report"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function LoadingView({ text = "Thinking up great alternatives…" }) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <motion.div
          className="p-3 rounded-full border"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-6 h-6" />
        </motion.div>
        <p className="text-xs text-gray-600">{text}</p>
      </div>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="w-[100vw]  md:w-[70vw] md:h-[80vh] bg-white rounded-2xl shadow-2xl p-5 overflow-y-scroll">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <Dialog.Title className="text-base font-semibold">
                    Title Suggestions
                  </Dialog.Title>
                </div>
                <Dialog.Close className="rounded-lg p-1 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </Dialog.Close>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto pr-1">
                <AnimatePresence mode="wait">
                  {mode === "loading" && (
                    <motion.div key="loading" animate={{ opacity: 1 }}>
                      <LoadingView />
                    </motion.div>
                  )}

                  {mode === "titles" && (
                    <motion.div
                      key="titles"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      {titleBatches[batchIndex]?.map((t, i) => (
                        <TitleRow key={`${t}-${i}`} title={t} index={i} />
                      ))}

                      {/* Buttons */}
                      <div className="pt-4 flex flex-col md:flex-row justify-center gap-2">
                        <button
                          onClick={handleSeeMore}
                          className="w-full md:w-1/2 px-6 py-2 text-sm font-medium border border-gray-400
                                   rounded-2xl shadow-sm bg-white text-gray-900
                                   hover:bg-gray-100 transition cursor-pointer"
                        >
                          See More
                        </button>
                        {batchIndex > 0 && (
                          <button
                            onClick={handleBack}
                            className="w-full md:w-1/2 px-6 py-2 text-sm font-medium border border-gray-400
                                     rounded-2xl shadow-sm bg-white text-gray-900
                                     hover:bg-gray-100 transition cursor-pointer"
                          >
                            Back to Previous
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {mode === "report" && analyze.data && (
                    <motion.div
                      key="report"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            Performance Report
                          </h3>
                          <p className="text-sm text-gray-500">
                            {titleBatches[batchIndex][selectedIndex ?? 0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setMode("titles")}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
                          >
                            Return to Other Titles
                          </button>
                          <button
                            onClick={() =>
                              onUseTitle(
                                titleBatches[batchIndex][selectedIndex ?? 0]
                              )
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-black transition"
                          >
                            Use this Title
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                        <div className="mt-3 text-sm bg-white/50 p-3 rounded-md border border-gray-200 m-4">
                          <strong>Scores:</strong>{" "}
                          {Object.entries(analyze.data.scores).map(([k, v]) => (
                            <span key={k} className="mr-3">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-green-700 mb-2">
                              Pros
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {analyze.data.pros.map((p, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">●</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-orange-700 mb-2">
                              Cons
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {analyze.data.cons.map((c, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">
                                    ●
                                  </span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
