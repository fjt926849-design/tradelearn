"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

export default function TermProgressAction({ termId }: { termId: string }) {
  const { getStatus, markOpened, markMastered, markNew, markReview } = useTermCardProgress();
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const status = hydrated ? getStatus(termId) : "new";

  useEffect(() => {
    markOpened(termId);
  }, [markOpened, termId]);

  const activeStatus = status === "mastered" || status === "review" ? status : "new";
  const statusOptions = [
    { key: "new", label: "未完成", dot: "○", color: "#666", border: "#d8d8d8", background: "#f7f7f7", onSelect: () => markNew(termId) },
    { key: "mastered", label: "已掌握", dot: "●", color: "#2f7d55", border: "#b9ddc8", background: "#effaf3", onSelect: () => markMastered(termId) },
    { key: "review", label: "再看看", dot: "●", color: "#b33a3a", border: "#edb7b7", background: "#fff2f2", onSelect: () => markReview(termId) },
  ] as const;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {statusOptions.map((option) => {
        const isActive = activeStatus === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={option.onSelect}
            aria-pressed={isActive}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:brightness-95"
            style={{ borderColor: isActive ? option.border : "#d8d8d8", color: isActive ? option.color : "#666", background: isActive ? option.background : "transparent", boxShadow: isActive ? "inset 0 0 0 1px rgba(0,0,0,.02)" : "none" }}
          >
            <span aria-hidden="true">{option.dot}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
