// src/components/TitleModal.tsx
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useSuggestTitles, useAnalyzeTitle } from "../hooks/useAI";
import { cn } from "../lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  onUseTitle: (title: string) => void;
};

export default function TitleModal({
  open,
  onClose,
  courseId,
  onUseTitle,
}: Props) {
  const suggest = useSuggestTitles(); // ✅ returns string[]
  const analyze = useAnalyzeTitle();

  const [temperature, setTemperature] = useState(0.6);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // Fetch suggestions when modal opens
  useEffect(() => {
  if (open) {
    suggest.mutate({ courseId, temperature });
  }
}, [open, courseId]); // ❌ removed temperature


  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Suggested Titles
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Generate and analyze suggested course titles
          </Dialog.Description>

          {/* Loading / Error */}
          {suggest.isPending && (
            <div className="flex items-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading
              suggestions...
            </div>
          )}
          {suggest.error && (
            <p className="text-red-500">Error loading suggestions</p>
          )}

          {/* Suggestions */}
          {suggest.data && suggest.data.length > 0 && (
            <ul className="space-y-2">
              {suggest.data.map((title, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="text-sm">{title}</span>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                      onClick={() => onUseTitle(title)}
                    >
                      Use this
                    </button>
                    <button
                      className={cn(
                        "rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700 flex items-center gap-1",
                        analyze.isPending && selectedTitle === title
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      )}
                      onClick={() => {
                        setSelectedTitle(title);
                        analyze.mutate({ courseId, proposedTitle: title });
                      }}
                      disabled={analyze.isPending && selectedTitle === title}
                    >
                      {analyze.isPending && selectedTitle === title && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Analyze
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* See more button */}
          <div className="mt-4">
            <button
              className="w-full rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                const newTemp = Math.min(1.0, temperature + 0.2);
                setTemperature(newTemp);
                suggest.mutate({ courseId, temperature: newTemp });
              }}
            >
              See More Suggestions
            </button>
          </div>

          {/* Analysis results */}
          {analyze.data && (
            <div className="mt-6 border-t pt-4">
              <h3 className="mb-2 font-semibold">
                Analysis for: {selectedTitle}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-700">Pros</p>
                  <ul className="ml-4 list-disc">
                    {analyze.data.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-red-700">Cons</p>
                  <ul className="ml-4 list-disc">
                    {analyze.data.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <strong>Scores:</strong>{" "}
                {Object.entries(analyze.data.scores).map(([k, v]) => (
                  <span key={k} className="mr-3">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
