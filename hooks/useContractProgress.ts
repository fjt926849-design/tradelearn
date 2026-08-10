"use client";

import { useConceptProgress } from "@/hooks/useConceptProgress";

const STORAGE_KEY = "tradelearn-contract-progress";

export function useContractProgress() {
  return useConceptProgress(STORAGE_KEY);
}
