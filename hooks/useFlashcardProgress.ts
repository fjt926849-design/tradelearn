"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type {
  FlashcardProgress,
  TermProgress,
  SelfRating,
} from "@/lib/types";
import { calcNextReview } from "@/lib/types";

const STORAGE_KEY = "tradelearn-flashcard-progress";

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

const defaultProgress: FlashcardProgress = { terms: {} };

/** 兼容旧数据：补全缺失的 nextReviewAt / interval */
function normalize(term: Partial<TermProgress> & { termCode: string }): TermProgress {
  return {
    termCode: term.termCode,
    status: term.status ?? "new",
    lastReviewed: term.lastReviewed ?? 0,
    reviewCount: term.reviewCount ?? 0,
    nextReviewAt: term.nextReviewAt ?? 0,
    interval: term.interval ?? 0,
  };
}

export function useFlashcardProgress() {
  const [progress, setProgress] = useLocalStorage<FlashcardProgress>(
    STORAGE_KEY,
    defaultProgress
  );

  /** 获取单个术语进度（保证字段完整） */
  const getTermProgress = useCallback(
    (termCode: string): TermProgress => {
      const raw = progress.terms[termCode];
      // 防护：排除非对象值（字符串、数字等可能由损坏数据产生）
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return normalize(raw);
      }
      return normalize({ termCode, status: "new" });
    },
    [progress]
  );

  /** 自评后更新进度（计算间隔和下次复习时间） */
  const rateTerm = useCallback(
    (termCode: string, rating: SelfRating) => {
      setProgress((prev) => {
        const existing = prev.terms[termCode];
        const currentInterval = existing?.interval ?? 0;
        const { nextReviewAt, interval, status } = calcNextReview(
          rating,
          currentInterval
        );
        return {
          terms: {
            ...prev.terms,
            [termCode]: {
              termCode,
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

  /** 获取到期需要复习的卡片 code 列表 */
  const getDueCodes = useCallback(
    (allCodes: string[]): Set<string> => {
      const now = Date.now();
      const due = new Set<string>();
      for (const code of allCodes) {
        const p = getTermProgress(code);
        // 新卡片 或 到期（含旧数据 nextReviewAt=0）
        if (p.status === "new" || p.nextReviewAt === 0 || p.nextReviewAt <= now) {
          due.add(code);
        }
      }
      return due;
    },
    [getTermProgress]
  );

  /** 今日复习统计 */
  const todayStats = useCallback(
    (allCodes: string[]) => {
      const now = Date.now();
      let dueCount = 0;     // 到期待复习（非新卡片）
      let newCount = 0;     // 从未学过的
      let weakCount = 0;    // 薄弱（学习中）
      let masteredCount = 0;

      for (const code of allCodes) {
        const p = getTermProgress(code);
        if (p.status === "new") {
          newCount++;
          dueCount++; // 新卡片也算待学习
        } else {
          if (p.nextReviewAt <= now) dueCount++;
          if (p.status === "learning") weakCount++;
          if (p.status === "mastered" || p.status === "familiar") masteredCount++;
        }
      }
      return {
        dueCount,        // 今日待学总量
        newCount,        // 新卡片
        weakCount,       // 薄弱卡片
        masteredCount,   // 已掌握
        total: allCodes.length,
        estimatedMinutes: dueCount > 0 ? Math.max(1, Math.round(dueCount * 1.5)) : 0,
      };
    },
    [getTermProgress]
  );

  /** 生成复习队列（按优先级排序的 code 列表） */
  const buildReviewQueue = useCallback(
    (allCodes: string[]): string[] => {
      const now = Date.now();
      const priority = (code: string): number => {
        const p = getTermProgress(code);
        // 2 = 新卡片（优先检查，new 卡片 nextReviewAt=0 也会被下方的 <= now 误判）
        if (p.status === "new") return 2;
        // 0 = 最优先（到期且薄弱）
        if (p.status === "learning" && p.nextReviewAt <= now) return 0;
        // 1 = 到期但不是薄弱的
        if (p.nextReviewAt <= now) return 1;
        // 3+ = 还没到期
        return 3;
      };

      const due = allCodes.filter((c) => {
        const p = getTermProgress(c);
        return p.status === "new" || p.nextReviewAt <= now;
      });

      due.sort((a, b) => {
        const pa = priority(a) - priority(b);
        if (pa !== 0) return pa;
        return getTermProgress(a).lastReviewed - getTermProgress(b).lastReviewed;
      });

      return due;
    },
    [getTermProgress]
  );

  /** 获取薄弱术语代码列表（status 为 learning） */
  const getWeakTermCodes = useCallback(
    (allCodes: string[]): string[] => {
      return allCodes.filter((c) => getTermProgress(c).status === "learning");
    },
    [getTermProgress]
  );

  /** 获取最近一次待复习时间 */
  const getNextReviewInfo = useCallback(
    (allCodes: string[]): { timestamp: number | null; label: string } => {
      const now = Date.now();
      let earliest: number | null = null;
      let hasDue = false;
      for (const code of allCodes) {
        const p = getTermProgress(code);
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
    [getTermProgress]
  );

  const stats = useMemo(() => {
    const entries = Object.values(progress.terms).map(normalize);
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
    setProgress(defaultProgress);
  }, [setProgress]);

  return {
    progress,
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
