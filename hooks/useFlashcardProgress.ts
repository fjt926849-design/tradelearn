"use client";

import { useCallback, useMemo } from "react";
import { useConceptProgress } from "./useConceptProgress";
import type { TermProgress, SelfRating } from "@/lib/types";

const STORAGE_KEY = "tradelearn-flashcard-progress";

/**
 * Incoterms 闪卡进度 — useConceptProgress 的薄封装。
 * 保持旧 API 名称不变以向后兼容。
 */
export function useFlashcardProgress() {
  const engine = useConceptProgress(STORAGE_KEY, "incoterms");

  const getTermProgress = useCallback(
    (termCode: string): TermProgress => engine.getProgress(termCode),
    [engine]
  );

  const rateTerm = useCallback(
    (termCode: string, rating: SelfRating) => engine.rateConcept(termCode, rating),
    [engine]
  );

  const getDueCodes = useCallback(
    (allCodes: string[]): Set<string> => engine.getDueIds(allCodes),
    [engine]
  );

  const todayStats = useCallback(
    (allCodes: string[]) => engine.todayStats(allCodes),
    [engine]
  );

  const buildReviewQueue = useCallback(
    (allCodes: string[]): string[] => engine.buildReviewQueue(allCodes),
    [engine]
  );

  const getWeakTermCodes = useCallback(
    (allCodes: string[]): string[] => engine.getWeakIds(allCodes),
    [engine]
  );

  const getNextReviewInfo = useCallback(
    (allCodes: string[]) => engine.getNextReviewInfo(allCodes),
    [engine]
  );

  const stats = useMemo(() => engine.stats, [engine.stats]);

  const resetProgress = useCallback(() => engine.resetProgress(), [engine]);

  return {
    progress: engine.progress,
    getTermProgress,
    rateTerm,
    getDueCodes,
    todayStats,
    buildReviewQueue,
    getWeakTermCodes,
    getNextReviewInfo,
    stats,
    resetProgress,
  };
}
