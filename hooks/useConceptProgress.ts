"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { SelfRating, ConceptProgressMap } from "@/lib/types";
import { calcNextReview, defaultConceptProgress } from "@/lib/types";

/** 格式化下次复习时间 */
function formatNextLabel(nextReviewAt: number): string {
  const diff = nextReviewAt - Date.now();
  if (diff <= 0) return "现在";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} 分钟后`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时后`;
  return `${Math.floor(hours / 24)} 天后`;
}

/**
 * 通用概念进度引擎
 *
 * 任何知识模块（Incoterms / Settlement / Transport / …）共享同一套
 * 间隔复习逻辑，仅通过 storageKey 区分持久化命名空间。
 */
export function useConceptProgress(storageKey: string) {
  const [progress, setProgress] = useLocalStorage<ConceptProgressMap>(
    storageKey,
    defaultConceptProgress
  );

  /** 获取单个概念进度 */
  const getProgress = useCallback(
    (conceptId: string) => {
      const raw = progress.terms[conceptId];
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return {
          termCode: conceptId,
          status: raw.status ?? "new",
          lastReviewed: raw.lastReviewed ?? 0,
          reviewCount: raw.reviewCount ?? 0,
          nextReviewAt: raw.nextReviewAt ?? 0,
          interval: raw.interval ?? 0,
        };
      }
      return {
        termCode: conceptId,
        status: "new" as const,
        lastReviewed: 0,
        reviewCount: 0,
        nextReviewAt: 0,
        interval: 0,
      };
    },
    [progress]
  );

  /** 自评后更新进度 */
  const rateConcept = useCallback(
    (conceptId: string, rating: SelfRating) => {
      setProgress((prev) => {
        const existing = prev.terms[conceptId];
        const currentInterval = existing?.interval ?? 0;
        const { nextReviewAt, interval, status } = calcNextReview(
          rating,
          currentInterval
        );
        return {
          terms: {
            ...prev.terms,
            [conceptId]: {
              termCode: conceptId,
              status,
              lastReviewed: Date.now(),
              reviewCount: (existing?.reviewCount ?? 0) + 1,
              nextReviewAt,
              interval,
            },
          },
        };
      });
    },
    [setProgress]
  );

  /** 获取到期需要复习的概念 ID 集合 */
  const getDueIds = useCallback(
    (allIds: string[]): Set<string> => {
      const now = Date.now();
      const due = new Set<string>();
      for (const id of allIds) {
        const p = getProgress(id);
        if (p.status === "new" || p.nextReviewAt === 0 || p.nextReviewAt <= now) {
          due.add(id);
        }
      }
      return due;
    },
    [getProgress]
  );

  /** 今日复习统计 */
  const todayStats = useCallback(
    (allIds: string[]) => {
      const now = Date.now();
      let dueCount = 0;
      let newCount = 0;
      let weakCount = 0;
      let masteredCount = 0;

      for (const id of allIds) {
        const p = getProgress(id);
        if (p.status === "new") {
          newCount++;
          dueCount++;
        } else {
          if (p.nextReviewAt <= now) dueCount++;
          if (p.status === "learning") weakCount++;
          if (p.status === "mastered" || p.status === "familiar") masteredCount++;
        }
      }
      return {
        dueCount,
        newCount,
        weakCount,
        masteredCount,
        total: allIds.length,
        estimatedMinutes: dueCount > 0 ? Math.max(1, Math.round(dueCount * 1.5)) : 0,
      };
    },
    [getProgress]
  );

  /** 生成复习队列（按优先级排序） */
  const buildReviewQueue = useCallback(
    (allIds: string[]): string[] => {
      const now = Date.now();
      const priority = (id: string): number => {
        const p = getProgress(id);
        if (p.status === "new") return 2;
        if (p.status === "learning" && p.nextReviewAt <= now) return 0;
        if (p.nextReviewAt <= now) return 1;
        return 3;
      };

      const due = allIds.filter((id) => {
        const p = getProgress(id);
        return p.status === "new" || p.nextReviewAt <= now;
      });

      due.sort((a, b) => {
        const pa = priority(a) - priority(b);
        if (pa !== 0) return pa;
        return getProgress(a).lastReviewed - getProgress(b).lastReviewed;
      });

      return due;
    },
    [getProgress]
  );

  /** 获取薄弱概念 ID 列表（status 为 learning） */
  const getWeakIds = useCallback(
    (allIds: string[]): string[] => {
      return allIds.filter((id) => getProgress(id).status === "learning");
    },
    [getProgress]
  );

  /** 获取最近一次待复习时间 */
  const getNextReviewInfo = useCallback(
    (allIds: string[]): { timestamp: number | null; label: string } => {
      const now = Date.now();
      let earliest: number | null = null;
      let hasDue = false;
      for (const id of allIds) {
        const p = getProgress(id);
        if (p.nextReviewAt > now) {
          if (earliest === null || p.nextReviewAt < earliest) {
            earliest = p.nextReviewAt;
          }
        } else {
          hasDue = true;
        }
      }
      if (earliest !== null) return { timestamp: earliest, label: formatNextLabel(earliest) };
      if (hasDue) return { timestamp: null, label: "现在" };
      return { timestamp: null, label: "暂无" };
    },
    [getProgress]
  );

  const stats = useMemo(() => {
    const entries = Object.values(progress.terms);
    return {
      total: entries.length,
      mastered: entries.filter(
        (e) => e.status === "mastered" || e.status === "familiar"
      ).length,
      familiar: entries.filter((e) => e.status === "familiar").length,
      learning: entries.filter((e) => e.status === "learning").length,
      overallProgress:
        entries.length > 0
          ? Math.round(
              (entries.filter((e) => e.status !== "new").length /
                entries.length) *
                100
            )
          : 0,
    };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress(defaultConceptProgress);
  }, [setProgress]);

  return {
    progress,
    getProgress,
    rateConcept,
    getDueIds,
    todayStats,
    buildReviewQueue,
    getWeakIds,
    getNextReviewInfo,
    stats,
    resetProgress,
  };
}
