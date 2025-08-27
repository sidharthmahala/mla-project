// src/components/TitleModal/ReportView.tsx
type Props = {
  title: string;
  analyzeData: {
    scores: Record<string, number | string>;
    pros: string[];
    cons: string[];
  };
  onReturn: () => void;
  onUseTitle: (title: string) => void;
};

export default function ReportView({ title, analyzeData, onReturn, onUseTitle }: Props) {
  return (
    <div className="space-y-4">
      {/* Header (desktop only) */}
      <div className="flex justify-between items-start hidden md:flex">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Performance Report</h3>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReturn}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
          >
            Return to Other Titles
          </button>
          <button
            onClick={() => onUseTitle(title)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-black transition"
          >
            Use this Title
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <div className="mt-3 text-sm bg-white/50 p-3 rounded-md border border-gray-200 m-4">
          <strong>Scores:</strong>{" "}
          {Object.entries(analyzeData.scores).map(([k, v]) => (
            <span key={k} className="mr-3">
              {k}: {v}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2">Pros</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {analyzeData.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-orange-700 mb-2">Cons</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {analyzeData.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">●</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
      </div>
      {/* Mobile buttons below content */}
        <div className="mt-6 flex gap-2 md:hidden">
          <button
            onClick={() => onUseTitle(title)}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-black transition"
          >
            Use Title
          </button>
          <button
            onClick={onReturn}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
          >
            Return to Titles
          </button>
        </div>
    </div>
  );
}
