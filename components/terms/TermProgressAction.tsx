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
  const statusColor = isMastered ? "#b33a3a" : status === "learning" ? "#2f7d55" : "#666";
  const statusBorder = isMastered ? "#edb7b7" : status === "learning" ? "#b9ddc8" : "#d8d8d8";
  const statusBackground = isMastered ? "#fff2f2" : status === "learning" ? "#effaf3" : "#f7f7f7";
  const actionColor = isMastered ? "#b33a3a" : "#2f7d55";
  const actionBackground = isMastered ? "#fff2f2" : "#effaf3";
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium" style={{ borderColor: statusBorder, color: statusColor, background: statusBackground }}>
        <span aria-hidden="true">{isMastered ? "●" : status === "learning" ? "◉" : "○"}</span>
        {isMastered ? "已掌握" : status === "learning" ? "学习中" : "未开始"}
      </span>
      <button type="button" onClick={() => (isMastered ? markNew(termId) : markMastered(termId))} className="rounded-xl border px-3 py-2 text-xs font-medium transition hover:brightness-95" style={{ borderColor: statusBorder, color: actionColor, background: actionBackground }}>
        {isMastered ? "取消掌握" : "标记为已掌握"}
      </button>
    </div>
  );
}
