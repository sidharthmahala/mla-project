// src/components/TitleModal/LoadingView.tsx
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingView({ text = "Thinking up great alternatives…" }) {
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
