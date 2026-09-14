"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trackLearningEvent } from "@/lib/analytics";
import { syncStoredCardProgress } from "@/lib/supabase/progressSync";
import type { LearnStatus, TermProgress } from "@/lib/types";

const STORAGE_KEY = "tradelearn-term-card-progress-v1";
const SYNC_MODULE_ID = "term-library";
const DAY_MS = 24 * 60 * 60 * 1000;
type TermCardStatus = "new" | "learning" | "mastered" | "review";

interface TermCardRecord {
  status: TermCardStatus;
  lastOpenedAt?: number;
  masteredAt?: number;
  reviewCount?: number;
  nextReviewAt?: number;
  interval?: number;
}

type StoredTermCardProgress = Record<string, TermCardRecord>;

function mapLegacyStatus(status: LearnStatus): TermCardStatus {
  if (status === "mastered" || status === "familiar") return "mastered";
  if (status === "learning") return "learning";
  return "new";
}

function toTermProgress(termId: string, record: TermCardRecord): TermProgress {
  return {
    termCode: termId,
    status: record.status === "review" ? "learning" : record.status,
    lastReviewed: record.lastOpenedAt ?? record.masteredAt ?? 0,
    reviewCount: record.reviewCount ?? 0,
    nextReviewAt: record.nextReviewAt ?? 0,
    interval: record.interval ?? 0,
  };
}

export function useTermCardProgress() {
  const [records, setRecords] = useLocalStorage<StoredTermCardProgress>(STORAGE_KEY, {});
  const legacy = useFlashcardProgress();
  const incotermCodes = useMemo(() => new Set(tradeTerms.map((term) => term.code)), []);
  const lastSyncedSnapshot = useRef("");

  useEffect(() => {
    const snapshot = JSON.stringify(records);
    if (snapshot === "{}" || snapshot === lastSyncedSnapshot.current) return;
    lastSyncedSnapshot.current = snapshot;
    void syncStoredCardProgress(
      SYNC_MODULE_ID,
      Object.entries(records).map(([termId, record]) => toTermProgress(termId, record)),
    );
  }, [records]);

  const getStatus = useCallback((termId: string): TermCardStatus => {
    const stored = records[termId];
    if (stored) return stored.status;
    if (incotermCodes.has(termId)) return mapLegacyStatus(legacy.getTermProgress(termId).status);
    return "new";
  }, [incotermCodes, legacy, records]);

  const markOpened = useCallback((termId: string) => {
    setRecords((previous) => {
      const current = previous[termId];
      if (current?.status === "mastered" || current?.status === "learning" || current?.status === "review") {
        return { ...previous, [termId]: { ...current, lastOpenedAt: Date.now() } };
      }
      return { ...previous, [termId]: { status: "learning", lastOpenedAt: Date.now() } };
    });
    trackLearningEvent("term_card_opened", { termId, contentLayer: "quick-term" });
  }, [setRecords]);

  const markMastered = useCallback((termId: string) => {
    const now = Date.now();
    setRecords((previous) => ({ ...previous, [termId]: {
      ...previous[termId],
      status: "mastered",
      lastOpenedAt: now,
      masteredAt: now,
      reviewCount: (previous[termId]?.reviewCount ?? 0) + 1,
      nextReviewAt: now + 7 * DAY_MS,
      interval: 7 * DAY_MS,
    } }));
    trackLearningEvent("term_card_status_changed", { termId, status: "mastered", contentLayer: "quick-term" });
  }, [setRecords]);

  const markNew = useCallback((termId: string) => {
    setRecords((previous) => ({ ...previous, [termId]: {
      status: "new",
      reviewCount: (previous[termId]?.reviewCount ?? 0) + 1,
      nextReviewAt: 0,
      interval: 0,
    } }));
    trackLearningEvent("term_card_status_changed", { termId, status: "new", contentLayer: "quick-term" });
  }, [setRecords]);

  const markReview = useCallback((termId: string) => {
    const now = Date.now();
    setRecords((previous) => ({ ...previous, [termId]: {
      ...previous[termId],
      status: "review",
      lastOpenedAt: now,
      reviewCount: (previous[termId]?.reviewCount ?? 0) + 1,
      nextReviewAt: now + DAY_MS,
      interval: DAY_MS,
    } }));
    trackLearningEvent("term_card_status_changed", { termId, status: "review", contentLayer: "quick-term" });
  }, [setRecords]);

  return { getStatus, markOpened, markMastered, markNew, markReview, records };
}
