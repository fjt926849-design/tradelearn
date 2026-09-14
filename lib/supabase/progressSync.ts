import { getSupabase } from "./client";
import { getDeviceId } from "./deviceId";
import type { TermProgress } from "@/lib/types";

type CardProgressRow = {
  user_id: string;
  curriculum_version: string;
  module_id: string;
  concept_id: string;
  status: TermProgress["status"];
  last_reviewed: string | null;
  next_review_at: string | null;
  review_count: number;
  interval_ms: number;
};

type LegacyCardProgressRow = Omit<CardProgressRow, "curriculum_version">;
let cardProgressSchema: "unknown" | "versioned" | "legacy" = "unknown";

function describeSyncError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>;
    return JSON.stringify({
      message: value.message,
      details: value.details,
      hint: value.hint,
      code: value.code,
    });
  }
  return String(error);
}

function isMissingCurriculumVersion(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const value = error as Record<string, unknown>;
  return value.code === "PGRST204" && String(value.message ?? "").includes("curriculum_version");
}

function toLegacyCardProgressRow(row: CardProgressRow): LegacyCardProgressRow {
  return {
    user_id: row.user_id,
    module_id: row.module_id,
    concept_id: row.concept_id,
    status: row.status,
    last_reviewed: row.last_reviewed,
    next_review_at: row.next_review_at,
    review_count: row.review_count,
    interval_ms: row.interval_ms,
  };
}

function toCardProgressRow(
  userId: string,
  moduleId: string,
  progress: TermProgress
): CardProgressRow {
  return {
    user_id: userId,
    curriculum_version: "v2",
    module_id: moduleId,
    concept_id: progress.termCode,
    status: progress.status,
    last_reviewed: progress.lastReviewed
      ? new Date(progress.lastReviewed).toISOString()
      : null,
    next_review_at: progress.nextReviewAt
      ? new Date(progress.nextReviewAt).toISOString()
      : null,
    review_count: progress.reviewCount,
    interval_ms: progress.interval,
  };
}

/**
 * 旁路同步层：把 localStorage 的写入镜像一份到 Supabase。
 *
 * 设计约定：
 * - fire-and-forget（调用方用 `void` 触发），绝不阻塞本地学习逻辑
 * - 未配置 env / 失败时静默降级（console.warn），localStorage 照常工作
 * - 读取仍以 localStorage 为主源，这里只负责「写」
 */

export async function syncCardProgress(
  moduleId: string,
  conceptId: string,
  progress: TermProgress
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const userId = getDeviceId();
  if (!userId) return;
  try {
    const row = toCardProgressRow(userId, moduleId, { ...progress, termCode: conceptId });
    let error;
    if (cardProgressSchema === "legacy") {
      ({ error } = await sb.from("card_progress").upsert(toLegacyCardProgressRow(row), {
        onConflict: "user_id,module_id,concept_id",
      }));
    } else {
      ({ error } = await sb.from("card_progress").upsert(row, {
        onConflict: "user_id,curriculum_version,module_id,concept_id",
      }));
    }
    if (error && isMissingCurriculumVersion(error)) {
      cardProgressSchema = "legacy";
      const fallback = await sb.from("card_progress").upsert(toLegacyCardProgressRow(row), {
        onConflict: "user_id,module_id,concept_id",
      });
      error = fallback.error;
    } else if (!error) {
      cardProgressSchema = cardProgressSchema === "legacy" ? "legacy" : "versioned";
    }
    if (error) throw error;
  } catch (e) {
    console.warn("[supabase] card_progress sync failed", describeSyncError(e));
  }
}

/**
 * 首次接入时把当前模块已有的 localStorage 进度批量镜像到 Supabase。
 * 不覆盖本地数据，也不从云端反向写回，避免改变现有学习行为。
 */
export async function syncStoredCardProgress(
  moduleId: string,
  progress: TermProgress[]
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const userId = getDeviceId();
  if (!userId || progress.length === 0) return;

  try {
    const rows = progress.map((item) => toCardProgressRow(userId, moduleId, item));
    let error;
    if (cardProgressSchema === "legacy") {
      ({ error } = await sb.from("card_progress").upsert(
        rows.map(toLegacyCardProgressRow),
        { onConflict: "user_id,module_id,concept_id" },
      ));
    } else {
      ({ error } = await sb.from("card_progress").upsert(
        rows,
        { onConflict: "user_id,curriculum_version,module_id,concept_id" },
      ));
    }
    if (error && isMissingCurriculumVersion(error)) {
      cardProgressSchema = "legacy";
      const fallback = await sb.from("card_progress").upsert(
        rows.map(toLegacyCardProgressRow),
        { onConflict: "user_id,module_id,concept_id" },
      );
      error = fallback.error;
    } else if (!error) {
      cardProgressSchema = cardProgressSchema === "legacy" ? "legacy" : "versioned";
    }
    if (error) throw error;
  } catch (e) {
    console.warn(
      "[supabase] stored card progress migration failed",
      describeSyncError(e)
    );
  }
}

export async function syncPracticeSession(session: {
  date: number;
  score: number;
  total: number;
  mistakeTermCodes: string[];
}): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const userId = getDeviceId();
  if (!userId) return;
  try {
    const { error } = await sb.from("practice_sessions").insert({
      user_id: userId,
      score: session.score,
      total: session.total,
      mistake_term_codes: session.mistakeTermCodes,
      created_at: new Date(session.date).toISOString(),
    });
    if (error) throw error;
  } catch (e) {
    console.warn("[supabase] practice_sessions sync failed", e);
  }
}

export async function syncPracticeAttempt(attempt: {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timestamp: number;
}): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const userId = getDeviceId();
  if (!userId) return;
  try {
    const { error } = await sb.from("practice_attempts").insert({
      user_id: userId,
      question_id: attempt.questionId,
      selected_index: attempt.selectedIndex,
      is_correct: attempt.isCorrect,
      created_at: new Date(attempt.timestamp).toISOString(),
    });
    if (error) throw error;
  } catch (e) {
    console.warn("[supabase] practice_attempts sync failed", e);
  }
}
