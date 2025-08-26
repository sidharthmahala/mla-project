// src/hooks/useCompareTitles.ts
import { useState } from "react";
import { api } from "../lib/api";

export function useCompareTitles(courseId: number) {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<null | { analyses: any[]; recommendation: string }>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);

  function toggleCompareSelection(title: string) {
    setSelectedForCompare((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }

  async function handleCompare() {
    setCompareLoading(true);
    setCompareOpen(true);
    try {
      const res = await api.post("/compare-titles", { courseId, titles: selectedForCompare });
      setCompareData(res.data);
    } finally {
      setCompareLoading(false);
    }
  }

  function closeCompare() {
    setCompareOpen(false);
    setCompareData(null);
    setSelectedForCompare([]);
  }

  return {
    selectedForCompare,
    compareData,
    compareOpen,
    compareLoading,
    toggleCompareSelection,
    handleCompare,
    closeCompare,
  };
}
