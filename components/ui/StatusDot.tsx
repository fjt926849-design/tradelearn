import type { LearnStatus } from "@/lib/types";

interface StatusDotProps {
  status: LearnStatus;
  showLabel?: boolean;
  /** 是否到期待复习（覆盖 status 显示） */
  isDue?: boolean;
}

const meta: Record<LearnStatus, { label: string; dot: string; color: string }> = {
  mastered:  { label: "已掌握", dot: "●", color: "var(--color-status-mastered)" },
  familiar:  { label: "已掌握", dot: "●", color: "var(--color-status-mastered)" },
  learning:  { label: "学习中", dot: "◉", color: "var(--color-status-learning)" },
  new:       { label: "未开始", dot: "○", color: "var(--color-status-new)" },
};

const dueMeta = { label: "待复习", dot: "◎", color: "var(--color-status-review)" };

export default function StatusDot({
  status,
  showLabel = true,
  isDue = false,
}: StatusDotProps) {
  const m = isDue ? dueMeta : meta[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm"
      style={{ color: m.color }}
    >
      <span className="text-base leading-none">{m.dot}</span>
      {showLabel && (
        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {m.label}
        </span>
      )}
    </span>
  );
}
