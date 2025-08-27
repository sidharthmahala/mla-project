// src/components/TitleModal/LoadingView.tsx
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json"; // put your Lottie JSON here

export default function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
      {/* Lottie animation */}
      <div className="w-28 h-28">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>

      {/* Main Heading */}
      <div className="max-w-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          AI is crafting perfect titles for you
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Our advanced AI is analyzing market trends, SEO potential, and
          engagement patterns to generate the most effective course titles.
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-700">
        {[
          "Analyzing market trends",
          "Optimizing for SEO",
          "Crafting compelling titles",
        ].map((step, idx) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.4 }}
            className="flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {step}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
