"use client";

export const PROGRESS_MIGRATION_KEY = "tradelearn-progress-migration-v2";

const LEGACY_KEYS = [
  "tradelearn-flashcard-progress",
  "tradelearn-settlement-progress",
  "tradelearn-transport-progress",
  "tradelearn-insurance-progress",
  "tradelearn-documents-progress",
  "tradelearn-customs-progress",
  "tradelearn-contract-progress",
  "tradelearn-practice-progress",
];

/**
 * Create a non-destructive snapshot marker before V2 writes anything.
 * The existing keys remain the source of truth, so this is safe to run on
 * every page and gives us an audit trail for future schema migrations.
 */
export function ensureProgressMigrationSnapshot() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(PROGRESS_MIGRATION_KEY)) return;

  const snapshot: Record<string, string | null> = {};
  for (const key of LEGACY_KEYS) snapshot[key] = window.localStorage.getItem(key);

  try {
    window.localStorage.setItem(
      PROGRESS_MIGRATION_KEY,
      JSON.stringify({ version: 2, migratedAt: Date.now(), keys: snapshot })
    );
  } catch {
    // Storage may be unavailable or full; never block learning.
  }
}
