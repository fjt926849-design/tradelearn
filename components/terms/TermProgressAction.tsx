"use client";

import { useEffect } from "react";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

export default function TermProgressAction({ termId }: { termId: string }) {
  const { getStatus, markOpened, markMastered, markNew } = useTermCardProgress();
  const status = getStatus(termId);

  useEffect(() => {
    markOpened(termId);
  }, [markOpened, termId]);

  const isMastered = status === "mastered";
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-xs" style={{ borderColor: "#d8d8d8", color: isMastered ? "#3f8a60" : "#666" }}>
        <span aria-hidden="true">{isMastered ? "●" : status === "learning" ? "◉" : "○"}</span>
        {isMastered ? "已掌握" : status === "learning" ? "学习中" : "未开始"}
      </span>
      <button type="button" onClick={() => (isMastered ? markNew(termId) : markMastered(termId))} className="rounded-xl border bg-white/75 px-3 py-2 text-xs font-medium transition hover:bg-white" style={{ borderColor: "#d8d8d8" }}>
        {isMastered ? "取消掌握" : "标记为已掌握"}
      </button>
    </div>
  );
}
