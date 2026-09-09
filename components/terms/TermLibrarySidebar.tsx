"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { termLibraryChapters } from "@/data/term-library";

type SidebarStatus = "new" | "learning" | "mastered";
type SidebarRecords = Record<string, { status?: SidebarStatus }>;
type LegacySidebarRecords = Record<string, { status?: SidebarStatus | "familiar" }>;

const emptySidebarRecords: SidebarRecords = {};
let cachedSidebarRecords: SidebarRecords | null = null;

function readSidebarRecords() {
  if (typeof window === "undefined") return emptySidebarRecords;
  if (cachedSidebarRecords) return cachedSidebarRecords;

  try {
    const termRecords = JSON.parse(window.localStorage.getItem("tradelearn-term-card-progress-v1") ?? "{}") as SidebarRecords;
    const legacy = JSON.parse(window.localStorage.getItem("tradelearn-flashcard-progress") ?? "{}") as { terms?: LegacySidebarRecords };
    const legacyRecords = Object.fromEntries(
      Object.entries(legacy.terms ?? {}).map(([id, record]) => [id, { status: record.status === "mastered" || record.status === "familiar" ? "mastered" : record.status === "learning" ? "learning" : "new" }]),
    ) satisfies SidebarRecords;
    cachedSidebarRecords = { ...legacyRecords, ...termRecords };
  } catch {
    cachedSidebarRecords = emptySidebarRecords;
  }

  return cachedSidebarRecords;
}

function useSidebarStatus() {
  const records = useSyncExternalStore(
    () => () => undefined,
    readSidebarRecords,
    () => emptySidebarRecords,
  );

  return (termId: string): SidebarStatus => records[termId]?.status ?? "new";
}

type TermLibrarySidebarProps = {
  currentId: string;
  currentChapterId: string;
};

export default function TermLibrarySidebar({ currentId, currentChapterId }: TermLibrarySidebarProps) {
  const [expandedChapter, setExpandedChapter] = useState(currentChapterId);
  const [mobileOpen, setMobileOpen] = useState(false);
  const getStatus = useSidebarStatus();

  return (
    <aside aria-label="术语目录" className="lg:sticky lg:top-20 lg:self-start">
      <div className="lg:hidden rounded-2xl border bg-white/70" style={{ borderColor: "#dedede" }}>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
          aria-expanded={mobileOpen}
        >
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>TERM INDEX</span>
            <span className="mt-1 block text-sm font-medium">切换术语 · {termLibraryChapters.find((chapter) => chapter.id === currentChapterId)?.title ?? "术语目录"}</span>
          </span>
          <span className={`text-lg transition-transform ${mobileOpen ? "rotate-45" : ""}`} style={{ color: "#888" }} aria-hidden="true">＋</span>
        </button>
        {mobileOpen && <div className="border-t px-3 py-3" style={{ borderColor: "#e8e8e8" }}><ChapterList currentId={currentId} expandedChapter={expandedChapter} onToggle={setExpandedChapter} getStatus={getStatus} /></div>}
      </div>

      <div className="hidden max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-[22px] border bg-white/70 p-3 lg:block" style={{ borderColor: "#dedede" }}>
        <div className="px-2 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>TERM INDEX</p>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold tracking-[-0.02em]">术语目录</h2>
            <span className="text-[11px]" style={{ color: "#999" }}>9 篇章 · 44 词语</span>
          </div>
        </div>
        <ChapterList currentId={currentId} expandedChapter={expandedChapter} onToggle={setExpandedChapter} getStatus={getStatus} />
      </div>
    </aside>
  );
}

function ChapterList({
  currentId,
  expandedChapter,
  onToggle,
  getStatus,
}: {
  currentId: string;
  expandedChapter: string;
  onToggle: (chapterId: string) => void;
  getStatus: (termId: string) => SidebarStatus;
}) {
  return (
    <div className="space-y-1">
      {termLibraryChapters.map((chapter) => {
        const isExpanded = expandedChapter === chapter.id;
        const mastered = chapter.terms.filter((term) => getStatus(term.id) === "mastered").length;
        return (
          <section key={chapter.id} className="overflow-hidden rounded-xl border" style={{ borderColor: isExpanded ? "#d2d2d2" : "transparent" }}>
            <button
              type="button"
              onClick={() => onToggle(isExpanded ? "" : chapter.id)}
              className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#fafafa]"
              aria-expanded={isExpanded}
              aria-controls={`term-chapter-${chapter.id}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f0f0] text-[10px] font-semibold" style={{ color: "#666" }}>{chapter.number}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">{chapter.title}</span>
                <span className="mt-0.5 block text-[10px]" style={{ color: "#999" }}>{mastered} / {chapter.terms.length} 已掌握</span>
              </span>
              <span className={`text-base transition-transform ${isExpanded ? "rotate-45" : ""}`} style={{ color: "#999" }} aria-hidden="true">＋</span>
            </button>

            {isExpanded && <div id={`term-chapter-${chapter.id}`} className="space-y-0.5 border-t px-1.5 py-1.5" style={{ borderColor: "#e8e8e8", background: "rgba(248,248,248,.55)" }}>
              {chapter.terms.map((term) => {
                const isCurrent = term.id === currentId;
                const status = getStatus(term.id);
                return (
                  <Link
                    key={term.id}
                    href={term.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className="flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors hover:bg-white"
                    style={{
                      borderColor: isCurrent ? "#bdbdbd" : "transparent",
                      background: isCurrent ? "#f5f5f5" : "transparent",
                    }}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: status === "mastered" ? "#2f7d55" : status === "learning" ? "#8bb69c" : "#d2d2d2" }} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-xs" style={{ color: isCurrent ? "#222" : "#555", fontWeight: isCurrent ? 600 : 400 }}>{term.code} <span style={{ color: isCurrent ? "#555" : "#888" }}>{term.name}</span></span>
                    <span className="text-[11px]" style={{ color: "#aaa" }} aria-hidden="true">↗</span>
                  </Link>
                );
              })}
            </div>}
          </section>
        );
      })}
    </div>
  );
}
