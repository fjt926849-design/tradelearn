"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { tradeTerms } from "@/data/trade-terms";
import { knowledgeMapData } from "@/data/knowledge-map";
import { STATUS_META } from "@/lib/types";
import type { LearnStatus } from "@/lib/types";

const ALL_CODES = tradeTerms.map((t) => t.code);

export default function HomePage() {
  const { getTermProgress, todayStats, getWeakTermCodes, getNextReviewInfo, stats } =
    useFlashcardProgress();
  const { getMistakeStats, hasMistakes, lastSession } = usePracticeProgress();
  const today = useMemo(() => todayStats(ALL_CODES), [todayStats]);
  const weakTermCodes = useMemo(() => getWeakTermCodes(ALL_CODES), [getWeakTermCodes]);
  const nextReviewInfo = useMemo(() => getNextReviewInfo(ALL_CODES), [getNextReviewInfo]);
  const mistakeStats = useMemo(() => getMistakeStats(), [getMistakeStats]);

  // Count per stored status
  const statusCounts: Record<LearnStatus, number> = {
    mastered: 0,
    familiar: 0,
    learning: 0,
    new: 0,
  };
  for (const term of tradeTerms) {
    statusCounts[getTermProgress(term.code).status]++;
  }

  // Recently reviewed
  const recentTerms = tradeTerms
    .map((t) => ({ term: t, progress: getTermProgress(t.code) }))
    .filter((p) => p.progress.lastReviewed > 0)
    .sort((a, b) => b.progress.lastReviewed - a.progress.lastReviewed)
    .slice(0, 3);

  const domains = knowledgeMapData.children ?? [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10 space-y-10">
        {/* ═══ 今日复习 ═══ */}
        <section>
          <div
            className="border rounded-lg p-5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="text-sm font-semibold mb-1">今日复习</h2>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="text-xl font-bold">{today.dueCount}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  待学习
                </div>
              </div>
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="text-xl font-bold"
                  style={{ color: "var(--color-status-learning)" }}
                >
                  {today.weakCount}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  薄弱
                </div>
              </div>
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="text-xl font-bold">{today.estimatedMinutes}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  分钟
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {today.dueCount === 0 ? (
                <span>✅ 暂无到期卡片，已掌握 {today.masteredCount} / {today.total} 个术语</span>
              ) : (
                <span>
                  新卡片 {today.newCount} 张 · 待复习 {today.dueCount - today.newCount} 张
                </span>
              )}
            </div>

            <div className="mt-4">
              {today.dueCount > 0 ? (
                <Link
                  href="/flashcards"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  开始今日学习 →
                </Link>
              ) : (
                <div
                  className="border rounded-lg p-4 text-center space-y-2"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <p className="text-sm font-medium">🎉 今日学习已完成</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    已掌握 {today.masteredCount} / {today.total} 个术语
                    {nextReviewInfo.timestamp && (
                      <> · 下次复习：{nextReviewInfo.label}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══ 薄弱知识 ═══ */}
        {today.weakCount > 0 && (
          <section>
            <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              薄弱知识
            </h2>
            <div
              className="mt-2 border rounded-lg p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-status-learning)" }}
                >
                  {today.weakCount} 个
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  术语需要加强
                </span>
              </div>
              <div className="space-y-1.5">
                {weakTermCodes.slice(0, 3).map((code) => {
                  const t = tradeTerms.find((x) => x.code === code)!;
                  return (
                    <Link
                      key={code}
                      href={`/terms/${code.toLowerCase()}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <span>{t.icon}</span>
                      <span className="font-medium">{t.code}</span>
                      <span style={{ color: "var(--color-text-muted)" }}>
                        {t.chineseName}
                      </span>
                    </Link>
                  );
                })}
                {weakTermCodes.length > 3 && (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    还有 {weakTermCodes.length - 3} 个薄弱术语
                  </p>
                )}
              </div>
              <div className="mt-3">
                <Link
                  href="/flashcards"
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  复习薄弱知识 →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 实战提示 ═══ */}
        {hasMistakes && mistakeStats.length > 0 && (
          <section>
            <div
              className="border rounded-lg p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📋</span>
                <div className="space-y-2 min-w-0">
                  <p className="text-sm font-medium">场景实战有薄弱点</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {mistakeStats.slice(0, 2).map((s) => s.termCode).join(" / ")} 容易混淆，建议多加练习。
                    {lastSession && (
                      <> 上次实战正确率：{Math.round((lastSession.score / lastSession.total) * 100)}%。</>
                    )}
                  </p>
                  <Link
                    href="/practice"
                    className="inline-flex items-center text-sm hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    去实战练习 →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 学习进度 ═══ */}
        <section>
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            学习进度
          </h2>
          <div
            className="mt-2 border rounded-lg p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold">
                {statusCounts.mastered + statusCounts.familiar}
              </span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                / {tradeTerms.length} 已掌握
              </span>
            </div>
            <div
              className="h-1.5 rounded-full w-full"
              style={{ background: "var(--color-border-light)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${stats.overallProgress}%`,
                  background: "var(--color-text)",
                }}
              />
            </div>
            <div className="mt-3 grid grid-cols-4 text-center">
              {(
                [
                  ["mastered", "已掌握"],
                  ["familiar", "已掌握"],
                  ["learning", "学习中"],
                  ["new", "未开始"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <div
                    className="text-lg font-semibold"
                    style={{ color: STATUS_META[key].color }}
                  >
                    {statusCounts[key]}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 最近学习 ═══ */}
        {recentTerms.length > 0 && (
          <section>
            <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              最近学习
            </h2>
            <div className="mt-2 space-y-px">
              {recentTerms.map(({ term, progress }) => {
                const timeAgo = getTimeAgo(progress.lastReviewed);
                const nextLabel = getNextLabel(progress.nextReviewAt);
                return (
                  <Link
                    key={term.code}
                    href={`/terms/${term.code.toLowerCase()}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">
                      <span className="font-medium">{term.code}</span>
                      <span
                        className="ml-2"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {term.chineseName}
                      </span>
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {timeAgo} · {nextLabel}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ 知识地图 ═══ */}
        <section>
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            知识地图
          </h2>
          <div
            className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-px border rounded-lg overflow-hidden"
            style={{ borderColor: "var(--color-border)" }}
          >
            {domains.map((d) =>
              d.isPlaceholder ? (
                <div
                  key={d.id}
                  className="p-4 text-center"
                  style={{ background: "var(--color-bg)" }}
                >
                  <span className="text-xl opacity-30">{d.icon}</span>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {d.title}
                  </p>
                  <p className="text-[10px]" style={{ color: "#ccc" }}>
                    即将开放
                  </p>
                </div>
              ) : (
                <Link
                  key={d.id}
                  href={d.route ?? "/"}
                  className="p-4 text-center hover:bg-gray-50 transition-colors"
                  style={{ background: "var(--color-bg)" }}
                >
                  <span className="text-xl">{d.icon}</span>
                  <p className="mt-1 text-xs font-medium">{d.title}</p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {tradeTerms.length} 个术语
                  </p>
                </Link>
              )
            )}
          </div>
        </section>

        {/* ═══ About ═══ */}
        <section
          className="pt-6 border-t text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            基于 Incoterms 2020 的国际贸易术语学习工具。
            <br />
            间隔复习系统帮助你科学安排学习节奏。
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function getTimeAgo(ts: number): string {
  if (ts <= 0) return "";
  const diff = Date.now() - ts;
  if (diff < 0) return ""; // 防护：时间戳在未来（时钟偏差等异常情况）
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

function getNextLabel(nextReviewAt: number): string {
  if (nextReviewAt <= 0) return "待复习";
  const diff = nextReviewAt - Date.now();
  if (diff <= 0) return "待复习";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} 小时后复习`;
  return `${Math.floor(hours / 24)} 天后复习`;
}
