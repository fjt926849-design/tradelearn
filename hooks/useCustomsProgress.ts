"use client";

import { useConceptProgress } from "@/hooks/useConceptProgress";

const STORAGE_KEY = "tradelearn-customs-progress";

export function useCustomsProgress() {
  return useConceptProgress(STORAGE_KEY, "customs");
}
