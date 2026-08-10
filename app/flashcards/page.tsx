import { Suspense } from "react";
import UnifiedFlashcards from "./UnifiedFlashcards";

export default function FlashcardsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 max-w-xl mx-auto px-5 py-20 text-center">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>加载中...</p>
        </div>
      }
    >
      <UnifiedFlashcards />
    </Suspense>
  );
}
