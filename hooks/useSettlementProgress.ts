"use client";

import { useConceptProgress } from "./useConceptProgress";

const STORAGE_KEY = "tradelearn-settlement-progress";

/**
 * 国际结算闪卡进度 — useConceptProgress 的薄封装。
 */
export function useSettlementProgress() {
  return useConceptProgress(STORAGE_KEY, "settlement");
}
