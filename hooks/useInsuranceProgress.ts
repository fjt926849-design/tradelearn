"use client";

import { useConceptProgress } from "@/hooks/useConceptProgress";

const STORAGE_KEY = "tradelearn-insurance-progress";

export function useInsuranceProgress() {
  return useConceptProgress(STORAGE_KEY, "insurance");
}
