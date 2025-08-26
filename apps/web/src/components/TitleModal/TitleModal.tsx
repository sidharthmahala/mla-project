// src/components/TitleModal/TitleModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useSuggestTitles, useAnalyzeTitle } from "../../hooks/useAI";
import { useUpdateCourseTitle } from "../../hooks/useCourses";
import ComparisonModal from "../ComparisonModal";
import TitleRow from "./TitleRow";
import LoadingView from "./LoadingView";
import ReportView from "./ReportView";
import { useCompareTitles } from "../../hooks/useCompareTitles";

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
  const updateCourseTitle = useUpdateCourseTitle();

  const [temperature, setTemperature] = useState(0.6);
  const [mode, setMode] = useState<Mode>("loading");
  const [titleBatches, setTitleBatches] = useState<string[][]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const {
    selectedForCompare,
    compareOpen,
    compareData,
    compareLoading,
    toggleCompareSelection,
    handleCompare,
    closeCompare,
  } = useCompareTitles(courseId);

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
      { onSuccess: () => setMode("report") }
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
            <div className=" w-[95vw] h-[95vh] md:w-[70vw] md:h-[80vh] bg-white rounded-2xl shadow-2xl p-5 overflow-y-auto">
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
                  {mode === "loading" && <LoadingView />}

                  {mode === "titles" && (
                    <motion.div
                      key="titles"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      {titleBatches[batchIndex]?.map((t, i) => (
                        <TitleRow
                          key={`${t}-${i}`}
                          title={t}
                          index={i}
                          selectedIndex={selectedIndex}
                          mode={mode}
                          isPending={updateCourseTitle.isPending}
                          onUseTitle={handleUseTitle}
                          onAnalyze={handleAnalyze}
                          analyze={analyze}
                          toggleCompareSelection={toggleCompareSelection}
                          selectedForCompare={selectedForCompare}
                          onToggle={(next) => setSelectedIndex(next)}
                        />
                      ))}

                      {/* Buttons */}
                      <div className="pt-4 flex flex-col md:flex-row justify-center gap-2">
                        <button
                          onClick={handleSeeMore}
                          className="w-full md:w-1/2 px-6 py-2 text-sm font-medium border border-gray-400 rounded-2xl shadow-sm bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                        >
                          See More
                        </button>
                        {selectedForCompare.length >= 2 && (
                          <button
                            onClick={handleCompare}
                            className="w-full md:w-1/2 px-6 py-2 text-sm font-medium border border-gray-400 rounded-2xl shadow-sm bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                          >
                            Compare Selected
                          </button>
                        )}
                        {batchIndex > 0 && (
                          <button
                            onClick={handleBack}
                            className="w-full md:w-1/2 px-6 py-2 text-sm font-medium border border-gray-400 rounded-2xl shadow-sm bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                          >
                            Back to Previous
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {mode === "report" && analyze.data && (
                    <ReportView
                      title={titleBatches[batchIndex][selectedIndex ?? 0]}
                      analyzeData={analyze.data}
                      onReturn={() => setMode("titles")}
                      onUseTitle={handleUseTitle}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Comparison Modal */}
      {compareOpen && (
        <ComparisonModal
          open={compareOpen}
          onClose={closeCompare}
          analyses={compareData?.analyses || []}
          recommendation={compareData?.recommendation || ""}
          loading={compareLoading}
          onUseTitle={(title) => {
            handleUseTitle(title);
            closeCompare();
          }}
        />
      )}
    </Dialog.Root>
  );
}
