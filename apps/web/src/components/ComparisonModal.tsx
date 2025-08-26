import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  analyses: any[];
  recommendation: string;
  loading: boolean;
  onUseTitle: (title: string) => void;
};

export default function ComparisonModal({
  open,
  onClose,
  analyses,
  recommendation,
  loading,
  onUseTitle,
}: Props) {
  // Fallback blur: if backdrop-filter isn't supported, blur the app root instead
  useEffect(() => {
    const supportsBackdrop =
      typeof CSS !== "undefined" &&
      (CSS.supports?.("backdrop-filter", "blur(1px)") ||
        CSS.supports?.("-webkit-backdrop-filter", "blur(1px)"));

    if (open && !supportsBackdrop) {
      document.documentElement.classList.add("modal-open-blur");
    } else {
      document.documentElement.classList.remove("modal-open-blur");
    }

    return () => {
      document.documentElement.classList.remove("modal-open-blur");
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* ✅ Strong blur overlay (with WebKit prefix via inline style) */}
        <Dialog.Overlay
          className="fixed inset-0 z-[60] bg-black/30"
          style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        />

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
          >
            {/* Mobile max-h 95vh + desktop unchanged; internal scroll area; sticky header */}
            <div className=" w-[95vw] h-[95vh] md:w-[70vw] md:h-[80vh] bg-white rounded-2xl shadow-2xl overflow-y-auto">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-6 py-3">
                <h2 className="text-lg font-semibold">Title Comparison</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
                  >
                    Back to Titles
                  </button>
                  <Dialog.Close className="rounded-lg p-1 hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </Dialog.Close>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    <p className="text-sm text-gray-600">Analyzing selected titles…</p>
                  </div>
                ) : analyses && analyses.length > 0 ? (
                  <div className="space-y-6">
                    {/* Table (unchanged desktop behavior) */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 border">Metric</th>
                            {analyses.map((a, idx) => (
                              <th
                                key={idx}
                                className={`p-3 border font-medium ${
                                  recommendation.includes(a.title) ? "bg-green-100" : ""
                                }`}
                              >
                                {a.title}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(analyses[0].scores || {}).map((metric) => (
                            <tr key={metric}>
                              <td className="p-2 border font-medium">{metric}</td>
                              {analyses.map((a, idx) => (
                                <td key={idx} className="p-2 border text-center">
                                  {a.scores?.[metric] ?? "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pros / Cons (unchanged) */}
                    <div className="grid grid-cols-1 md:grid-cols-analyses gap-6">
                      {analyses.map((a, idx) => {
                        const isRecommended = recommendation.includes(a.title);
                        return (
                          <div
                            key={idx}
                            className={`relative p-4 border rounded-lg ${
                              isRecommended ? "border-green-400 bg-green-50" : "border-gray-200"
                            }`}
                          >
                            {isRecommended && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-200 text-green-800">
                                Recommended
                              </span>
                            )}

                            <h4 className="font-semibold mb-2">{a.title}</h4>

                            <div className="mb-3">
                              <h5 className="text-green-700 font-medium">Pros</h5>
                              <ul className="list-disc ml-4 text-sm text-gray-700">
                                {a.pros?.map((p: string, i: number) => (
                                  <li key={i}>{p}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="mb-3">
                              <h5 className="text-orange-700 font-medium">Cons</h5>
                              <ul className="list-disc ml-4 text-sm text-gray-700">
                                {a.cons?.map((c: string, i: number) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>

                            <button
                              onClick={() => onUseTitle(a.title)}
                              className="mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              Use this Title
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recommendation (unchanged) */}
                    {recommendation && (
                      <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                          Recommended Choice
                        </h4>
                        <p className="text-base font-bold text-gray-900 mb-3">
                          {recommendation.match(/"([^"]+)"/)?.[1] || "No title found"}
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {recommendation
                            .split(/\d+\./)
                            .slice(1)
                            .map((point, i) => (
                              <li key={i}>{point.trim().replace(/\*\*/g, "")}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No comparison data available.</p>
                )}
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
