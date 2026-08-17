import { getSupabase } from "./client";
import { getDeviceId } from "./deviceId";
import type { TermProgress } from "@/lib/types";

type CardProgressRow = {
  user_id: string;
  module_id: string;
  concept_id: string;
  status: TermProgress["status"];
  last_reviewed: string | null;
  next_review_at: string | null;
  review_count: number;
  interval_ms: number;
};

function toCardProgressRow(
  userId: string,
  moduleId: string,
  progress: TermProgress
): CardProgressRow {
  return {
    user_id: userId,
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
    const { error } = await sb
      .from("card_progress")
      .upsert(toCardProgressRow(userId, moduleId, { ...progress, termCode: conceptId }), {
        onConflict: "user_id,module_id,concept_id",
      });
    if (error) throw error;
  } catch (e) {
    console.warn("[supabase] card_progress sync failed", e);
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
    const { error } = await sb.from("card_progress").upsert(
      progress.map((item) => toCardProgressRow(userId, moduleId, item)),
      { onConflict: "user_id,module_id,concept_id" }
    );
    if (error) throw error;
  } catch (e) {
    console.warn("[supabase] stored card progress migration failed", e);
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
