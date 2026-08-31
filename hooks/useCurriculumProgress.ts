"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { curriculumChapters } from "@/data/curriculum";
import { curriculumLegacyMapping } from "@/data/curriculum-mapping";
import { useContractProgress } from "@/hooks/useContractProgress";
import { useCustomsProgress } from "@/hooks/useCustomsProgress";
import { useDocumentsProgress } from "@/hooks/useDocumentsProgress";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { useInsuranceProgress } from "@/hooks/useInsuranceProgress";
import { useSettlementProgress } from "@/hooks/useSettlementProgress";
import { useTransportProgress } from "@/hooks/useTransportProgress";
import type { CurriculumProgressRecord, LearnStatus, ModuleId } from "@/lib/types";

const STORAGE_KEY = "tradelearn-curriculum-progress-v1";
type StoredProgress = Record<string, CurriculumProgressRecord>;

function readStoredProgress(): StoredProgress {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as StoredProgress;
  } catch {
    return {};
  }
}

function isKnown(status: LearnStatus) {
  return status === "familiar" || status === "mastered";
}

export interface ChapterProgressView extends CurriculumProgressRecord {
  progress: number;
  legacyKnown: number;
  legacyTotal: number;
}

export function useCurriculumProgress() {
  const [records, setRecords] = useState<StoredProgress>({});
  const [hydrated, setHydrated] = useState(false);
  const incoterms = useFlashcardProgress();
  const settlement = useSettlementProgress();
  const transport = useTransportProgress();
  const insurance = useInsuranceProgress();
  const documents = useDocumentsProgress();
  const customs = useCustomsProgress();
  const contract = useContractProgress();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRecords(readStoredProgress());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Course progress must never block learning when storage is unavailable.
    }
  }, [hydrated, records]);

  const getLegacyStatus = useCallback((moduleId: ModuleId, conceptId: string): LearnStatus => {
    switch (moduleId) {
      case "incoterms": return incoterms.getTermProgress(conceptId).status;
      case "settlement": return settlement.getProgress(conceptId).status;
      case "transport": return transport.getProgress(conceptId).status;
      case "insurance": return insurance.getProgress(conceptId).status;
      case "documents": return documents.getProgress(conceptId).status;
      case "customs": return customs.getProgress(conceptId).status;
      case "contract": return contract.getProgress(conceptId).status;
    }
  }, [incoterms, settlement, transport, insurance, documents, customs, contract]);

  const getChapterProgress = useCallback((chapterId: string): ChapterProgressView => {
    const record = records[chapterId] ?? { chapterId, status: "new" as const };
    const mappings = curriculumLegacyMapping[chapterId] ?? [];
    const legacyConcepts = mappings.flatMap((mapping) => mapping.conceptIds.map((conceptId) => ({ mapping, conceptId })));
    const legacyKnown = legacyConcepts.filter(({ mapping, conceptId }) => isKnown(getLegacyStatus(mapping.moduleId, conceptId))).length;
    const legacyTotal = legacyConcepts.length;

    const hasOpenedChapter = Boolean(record.lastOpenedAt || record.lessonStartedAt || record.lessonCompletedAt);
    const hasCheckpoint = (record.checkpointTotal ?? 0) > 0;
    let progress = record.status === "completed" ? 100 : hasCheckpoint ? 60 : hasOpenedChapter ? 30 : 0;
    if (!hasOpenedChapter && legacyTotal > 0 && legacyKnown > 0) {
      progress = Math.max(30, Math.round((legacyKnown / legacyTotal) * 100));
    }
    const status = record.status === "new" && legacyKnown > 0 ? "learning" : record.status;
    return { ...record, status, progress, legacyKnown, legacyTotal };
  }, [getLegacyStatus, records]);

  const chapterProgress = useMemo(() => Object.fromEntries(curriculumChapters.map((chapter) => [chapter.id, getChapterProgress(chapter.id)])), [getChapterProgress]);

  const updateRecord = useCallback((chapterId: string, patch: Partial<CurriculumProgressRecord>) => {
    setRecords((previous) => {
      const current = previous[chapterId] ?? { chapterId, status: "new" as const };
      return { ...previous, [chapterId]: { ...current, ...patch, chapterId } };
    });
  }, []);

  const markChapterOpened = useCallback((chapterId: string) => {
    const now = Date.now();
    updateRecord(chapterId, { status: "learning", lastOpenedAt: now });
  }, [updateRecord]);

  const recordCheckpoint = useCallback((chapterId: string, score: number, total: number) => {
    setRecords((previous) => {
      const current = previous[chapterId] ?? { chapterId, status: "new" as const };
      const passed = score / total >= 2 / 3;
      return { ...previous, [chapterId]: { ...current, chapterId, status: passed ? "completed" : "learning", checkpointScore: score, checkpointTotal: total, lastOpenedAt: Date.now() } };
    });
  }, []);

  const addStudySeconds = useCallback((chapterId: string, seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const rounded = Math.round(seconds);
    setRecords((previous) => {
      const current = previous[chapterId] ?? { chapterId, status: "new" as const };
      return { ...previous, [chapterId]: { ...current, chapterId, studySeconds: (current.studySeconds ?? 0) + rounded, lastOpenedAt: Date.now() } };
    });
  }, []);

  const currentChapter = useMemo(() => {
    const active = curriculumChapters.find((chapter) => chapterProgress[chapter.id]?.status === "learning");
    if (active) return active;
    return curriculumChapters.find((chapter) => chapterProgress[chapter.id]?.status === "new") ?? curriculumChapters[0];
  }, [chapterProgress]);

  const completedCount = useMemo(() => curriculumChapters.filter((chapter) => chapterProgress[chapter.id]?.status === "completed").length, [chapterProgress]);
  const totalStudySeconds = useMemo(() => Object.values(chapterProgress).reduce((total, record) => total + (record.studySeconds ?? 0), 0), [chapterProgress]);

  return { chapterProgress, currentChapter, completedCount, totalStudySeconds, hydrated, markChapterOpened, recordCheckpoint, addStudySeconds };
}
