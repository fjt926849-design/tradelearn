"use client";

export type LearningEventName =
  | "flashcard_rated"
  | "practice_started"
  | "practice_answered"
  | "practice_completed"
  | "chapter_checkpoint_completed"
  | "curriculum_filtered"
  | "curriculum_opened"
  | "progress_migration";

export interface LearningEvent {
  name: LearningEventName;
  timestamp: number;
  payload?: Record<string, string | number | boolean>;
}

const EVENT_KEY = "tradelearn-learning-events";

/** Lightweight local event queue; it never blocks or interrupts learning. */
export function trackLearningEvent(name: LearningEventName, payload?: LearningEvent["payload"]) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(EVENT_KEY) ?? "[]");
    const events = Array.isArray(existing) ? existing : [];
    events.push({ name, timestamp: Date.now(), payload });
    window.localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-200)));
  } catch {
    // Analytics must never prevent a learner from progressing.
  }

  // Mirror the same event to GA4 when the configured script is ready.
  // The local queue remains the fallback when scripts are blocked or absent.
  if (window.gtag) {
    const gaPayload = Object.fromEntries(
      Object.entries(payload ?? {}).map(([key, value]) => [
        key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        value,
      ])
    );
    window.gtag("event", name, gaPayload);
  }
}
