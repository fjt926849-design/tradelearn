"use client";

import { useConceptProgress } from "@/hooks/useConceptProgress";

const STORAGE_KEY = "tradelearn-documents-progress";

export function useDocumentsProgress() {
  return useConceptProgress(STORAGE_KEY);
}
