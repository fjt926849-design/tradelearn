"use client";

import { useConceptProgress } from "@/hooks/useConceptProgress";

const STORAGE_KEY = "tradelearn-transport-progress";

export function useTransportProgress() {
  return useConceptProgress(STORAGE_KEY, "transport");
}
