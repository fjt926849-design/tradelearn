"use client";

import { useCallback, useMemo } from "react";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { LearnStatus } from "@/lib/types";

const STORAGE_KEY = "tradelearn-term-card-progress-v1";
type TermCardStatus = "new" | "learning" | "mastered";

interface TermCardRecord {
  status: TermCardStatus;
  lastOpenedAt?: number;
  masteredAt?: number;
}

type StoredTermCardProgress = Record<string, TermCardRecord>;

function mapLegacyStatus(status: LearnStatus): TermCardStatus {
  if (status === "mastered" || status === "familiar") return "mastered";
  if (status === "learning") return "learning";
  return "new";
}

export function useTermCardProgress() {
  const [records, setRecords] = useLocalStorage<StoredTermCardProgress>(STORAGE_KEY, {});
  const legacy = useFlashcardProgress();
  const incotermCodes = useMemo(() => new Set(tradeTerms.map((term) => term.code)), []);

  const getStatus = useCallback((termId: string): TermCardStatus => {
    const stored = records[termId];
    if (stored) return stored.status;
    if (incotermCodes.has(termId)) return mapLegacyStatus(legacy.getTermProgress(termId).status);
    return "new";
  }, [incotermCodes, legacy, records]);

  const markOpened = useCallback((termId: string) => {
    setRecords((previous) => {
      const current = previous[termId];
      if (current?.status === "mastered" || current?.status === "learning") {
        return { ...previous, [termId]: { ...current, lastOpenedAt: Date.now() } };
      }
      return { ...previous, [termId]: { status: "learning", lastOpenedAt: Date.now() } };
    });
  }, [setRecords]);

  const markMastered = useCallback((termId: string) => {
    setRecords((previous) => ({
      ...previous,
      [termId]: { status: "mastered", lastOpenedAt: Date.now(), masteredAt: Date.now() },
    }));
  }, [setRecords]);

  const markNew = useCallback((termId: string) => {
    setRecords((previous) => ({
      ...previous,
      [termId]: { status: "new" },
    }));
  }, [setRecords]);

  return { getStatus, markOpened, markMastered, markNew, records };
}
