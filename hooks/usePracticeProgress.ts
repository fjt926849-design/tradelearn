"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type {
  PracticeProgress,
  PracticeAttempt,
  PracticeSession,
} from "@/lib/types";

const STORAGE_KEY = "tradelearn-practice-progress";

const defaultProgress: PracticeProgress = {
  attempts: {},
  sessions: [],
};

/** 兼容旧数据/损坏数据：确保必要字段存在 */
function normalize(partial: Partial<PracticeProgress> | null | undefined): PracticeProgress {
  if (!partial || typeof partial !== "object") return defaultProgress;
  return {
    attempts: partial.attempts && typeof partial.attempts === "object" ? partial.attempts : {},
    sessions: Array.isArray(partial.sessions) ? partial.sessions : [],
  };
}

export function usePracticeProgress() {
  const [raw, setProgress] = useLocalStorage<PracticeProgress>(
    STORAGE_KEY,
    defaultProgress
  );

  // Normalize on every read — guards against corrupted/legacy localStorage data
  const progress = normalize(raw);

  /** 提交一次答题 */
  const submitAttempt = useCallback(
    (
      questionId: string,
      selectedIndex: number,
      isCorrect: boolean
    ) => {
      setProgress((prev) => {
        const safe = normalize(prev);
        const attempt: PracticeAttempt = {
          questionId,
          selectedIndex,
          isCorrect,
          timestamp: Date.now(),
        };
        const existing = safe.attempts[questionId] ?? [];
        return {
          ...safe,
          attempts: {
            ...safe.attempts,
            [questionId]: [...existing, attempt],
          },
        };
      });
    },
    [setProgress]
  );

  /** 完成一次实战会话 */
  const completeSession = useCallback(
    (score: number, total: number, mistakeTermCodes: string[]) => {
      setProgress((prev) => {
        const safe = normalize(prev);
        const session: PracticeSession = {
          date: Date.now(),
          score,
          total,
          mistakeTermCodes: [...new Set(mistakeTermCodes)],
        };
        return {
          ...safe,
          sessions: [...safe.sessions, session],
        };
      });
    },
    [setProgress]
  );

  /** 获取某道题的最后一次答题 */
  const getLastAttempt = useCallback(
    (questionId: string): PracticeAttempt | null => {
      const attempts = progress.attempts[questionId];
      if (!attempts || attempts.length === 0) return null;
      return attempts[attempts.length - 1];
    },
    [progress]
  );

  /** 统计答错最多的术语代码 */
  const getMistakeStats = useCallback((): {
    termCode: string;
    count: number;
  }[] => {
    const mistakeMap: Record<string, number> = {};
    for (const session of progress.sessions) {
      for (const code of session.mistakeTermCodes) {
        mistakeMap[code] = (mistakeMap[code] ?? 0) + 1;
      }
    }
    return Object.entries(mistakeMap)
      .map(([termCode, count]) => ({ termCode, count }))
      .sort((a, b) => b.count - a.count);
  }, [progress]);

  /** 是否答对过某道题（用于判断是否展示提示） */
  const hasMistakes = useMemo(() => {
    return progress.sessions.some((s) => s.mistakeTermCodes.length > 0);
  }, [progress]);

  /** 最近一次会话 */
  const lastSession = useMemo(() => {
    const sessions = progress.sessions;
    return sessions.length > 0 ? sessions[sessions.length - 1] : null;
  }, [progress]);

  /** 重置实战进度 */
  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, [setProgress]);

  return {
    progress,
    submitAttempt,
    completeSession,
    getLastAttempt,
    getMistakeStats,
    hasMistakes,
    lastSession,
    resetProgress,
  };
}
