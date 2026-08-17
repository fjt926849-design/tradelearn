"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";
import { tradeTerms } from "@/data/trade-terms";
import { knowledgeMapData } from "@/data/knowledge-map";

const ALL_CODES = tradeTerms.map((t) => t.code);

// knowledge-map 域名 → 章节编号（与 MODULE_CHAPTERS 对齐）
const DOMAIN_CHAPTER: Record<string, { no: string; en: string }> = {
  "trade-terms": { no: "01", en: "TERMS" },
  settlement: { no: "02", en: "PAYMENT" },
  "transport-logistics": { no: "03", en: "SHIPPING" },
  insurance: { no: "04", en: "INSURANCE" },
  documents: { no: "05", en: "DOCUMENTS" },
  customs: { no: "06", en: "CUSTOMS" },
  contract: { no: "07", en: "CONTRACT" },
};

const QUICK_ENTRIES = [
  { href: "/flashcards", tag: "FLASHCARDS", title: "闪卡复习", desc: "7 个模块独立追踪" },
  { href: "/practice", tag: "PRACTICE", title: "场景实战", desc: "7 个模块 + 综合模拟" },
  { href: "/practice/comprehensive", tag: "SIMULATION", title: "综合实战", desc: "全流程业务模拟" },
  { href: "/knowledge-map", tag: "MAP", title: "知识地图", desc: "全局知识结构浏览" },
];

export default function HomePage() {
  const { getTermProgress, todayStats, getWeakTermCodes, getNextReviewInfo } =
    useFlashcardProgress();
  const { getMistakeStats, hasMistakes, lastSession } = usePracticeProgress();
  const { aggregated, modules } = useProgressAggregator();

  const today = useMemo(() => todayStats(ALL_CODES), [todayStats]);
  const weakTermCodes = useMemo(() => getWeakTermCodes(ALL_CODES), [getWeakTermCodes]);
  const nextReviewInfo = useMemo(() => getNextReviewInfo(ALL_CODES), [getNextReviewInfo]);
  const mistakeStats = useMemo(() => getMistakeStats(), [getMistakeStats]);

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
      <main className="flex-1">
        <Hero
          totalConcepts={aggregated.totalConcepts}
          totalMastered={aggregated.totalMastered}
          overallProgress={aggregated.overallProgress}
        />

        <div className="max-w-2xl mx-auto px-5 py-10 space-y-10">
          {/* ═══ 今日学习（统一学习中心） ═══ */}
          <section>
            <div className="border rounded-lg p-5" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-semibold mb-1">今日学习</h2>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                全平台 {aggregated.totalConcepts} 个知识点 · 已掌握 {aggregated.totalMastered} 个
              </p>

              {/* Aggregated stats */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-md border p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-lg font-bold tabular-nums">{aggregated.totalDue}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>待复习</div>
                </div>
                <div className="rounded-md border p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-lg font-bold tabular-nums">{aggregated.totalNew}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>新知识</div>
                </div>
                <div className="rounded-md border p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-lg font-bold tabular-nums" style={{ color: "var(--color-status-learning)" }}>{aggregated.totalWeak}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>薄弱</div>
                </div>
                <div className="rounded-md border p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-lg font-bold tabular-nums">{aggregated.totalMastered}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>已掌握</div>
                </div>
              </div>

              {/* Overall progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 rounded-full flex-1" style={{ background: "var(--color-border-light)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${aggregated.overallProgress}%`, background: "var(--color-accent)" }}
                  />
                </div>
                <span className="text-xs font-medium shrink-0 tabular-nums">{aggregated.overallProgress}%</span>
              </div>

              {/* CTA */}
              <div className="mt-4">
                {aggregated.totalDue > 0 ? (
                  <Link
                    href="/flashcards"
                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                    style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
                  >
                    开始今日学习 →
                  </Link>
                ) : (
                  <div className="border rounded-lg p-4 text-center space-y-2" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-sm font-medium">今日学习已完成</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      已掌握 {aggregated.totalMastered} / {aggregated.totalConcepts} 个知识点
                      {nextReviewInfo.timestamp && <> · 下次复习：{nextReviewInfo.label}</>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ═══ 各模块进度 ═══ */}
          <section>
            <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              学习进度
            </h2>
            <div className="mt-2 border rounded-lg divide-y" style={{ borderColor: "var(--color-border)" }}>
              {modules.map((m) => (
                <Link
                  key={m.moduleId}
                  href={m.route}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="shrink-0 w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                    {m.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-medium">
                        {m.label}
                        <span className="ml-2 text-[10px] tracking-[0.14em]" style={{ color: "var(--color-text-muted)" }}>
                          {m.en}
                        </span>
                      </span>
                      <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                        {m.mastered + m.familiar}/{m.total}
                      </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "var(--color-border-light)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.progress}%`, background: "var(--color-accent)" }}
                      />
                    </div>
                  </div>
                  {m.dueCount > 0 && (
                    <span
                      className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
                    >
                      {m.dueCount} 待复习
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* ═══ 薄弱知识 ═══ */}
          {today.weakCount > 0 && (
            <section>
              <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                薄弱知识
              </h2>
              <div className="mt-2 border rounded-lg p-4" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-semibold" style={{ color: "var(--color-status-learning)" }}>{today.weakCount} 个</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>术语需要加强</span>
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
                        <span className="font-semibold tabular-nums">{t.code}</span>
                        <span style={{ color: "var(--color-text-muted)" }}>{t.chineseName}</span>
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
                    style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
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
              <div className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-start gap-3">
                  <span
                    className="shrink-0 mt-0.5 w-9 h-9 rounded-md flex items-center justify-center text-[10px] font-bold tracking-wider"
                    style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
                  >
                    实战
                  </span>
                  <div className="space-y-2 min-w-0">
                    <p className="text-sm font-medium">场景实战有薄弱点</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {mistakeStats.slice(0, 2).map((s) => s.termCode).join(" / ")} 容易混淆，建议多加练习。
                      {lastSession && <> 上次实战正确率：{Math.round((lastSession.score / lastSession.total) * 100)}%。</>}
                    </p>
                    <Link href="/practice" className="inline-flex items-center text-sm hover:underline" style={{ color: "var(--color-text)" }}>
                      去实战练习 →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ═══ 快速入口 ═══ */}
          <section>
            <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              快速入口
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {QUICK_ENTRIES.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-[10px] font-semibold tracking-[0.16em]" style={{ color: "var(--color-text-muted)" }}>
                    {q.tag}
                  </span>
                  <p className="mt-2 text-sm font-medium">{q.title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{q.desc}</p>
                </Link>
              ))}
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
                        <span className="font-semibold tabular-nums">{term.code}</span>
                        <span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{term.chineseName}</span>
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
              {domains.map((d) => {
                const ch = DOMAIN_CHAPTER[d.id] ?? { no: "—", en: "" };
                return (
                  <Link
                    key={d.id}
                    href={d.route ?? "/"}
                    className="p-4 text-center hover:bg-gray-50 transition-colors"
                    style={{ background: "var(--color-bg)" }}
                  >
                    <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                      {ch.no}
                    </span>
                    <p className="mt-1 text-xs font-medium">{d.title}</p>
                    <p className="mt-0.5 text-[10px] tracking-[0.12em]" style={{ color: "var(--color-text-muted)" }}>
                      {ch.en}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ═══ About ═══ */}
          <section className="pt-6 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              国际贸易实务一站式学习平台——贸易术语 · 国际结算 · 运输 · 保险 · 单据 · 报关 · 合同。
              <br />
              间隔复习系统帮助你科学安排学习节奏。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function getTimeAgo(ts: number): string {
  if (ts <= 0) return "";
  const diff = Date.now() - ts;
  if (diff < 0) return "";
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
