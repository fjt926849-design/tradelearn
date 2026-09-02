"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { tradeTerms } from "@/data/trade-terms";

const ALL_CODES = tradeTerms.map((term) => term.code);

export default function HomePage() {
  const { getWeakTermCodes, getTermProgress } = useFlashcardProgress();
  const { hasMistakes, lastSession, getMistakeStats } = usePracticeProgress();

  const weakTermCodes = getWeakTermCodes(ALL_CODES);
  const recentTerms = tradeTerms
    .map((term) => ({ term, progress: getTermProgress(term.code) }))
    .filter(({ progress }) => progress.lastReviewed > 0)
    .sort((a, b) => b.progress.lastReviewed - a.progress.lastReviewed)
    .slice(0, 3);

  const mistakeStats = getMistakeStats();
  const masteredTerms = tradeTerms.filter((term) => {
    const status = getTermProgress(term.code).status;
    return status === "mastered" || status === "familiar";
  }).length;
  const termProgress = tradeTerms.length ? Math.round((masteredTerms / tradeTerms.length) * 100) : 0;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero
          totalTerms={tradeTerms.length}
          masteredTerms={masteredTerms}
          termProgress={termProgress}
        />

        <div className="mx-auto max-w-6xl space-y-10 px-5 py-10">
          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">术语卡片</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>先认识缩写、中文含义和业务场景。</p></div><Link href="/terms-preview" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>浏览全部术语 →</Link></div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{tradeTerms.slice(0, 3).map((term) => <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="rounded-xl border p-5 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><p className="text-3xl font-semibold tracking-tight">{term.code}</p><p className="mt-2 text-base font-medium">{term.chineseName}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{term.fullName}</p><p className="mt-4 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{term.summary}</p></Link>)}</div>
          </section>

          {(weakTermCodes.length > 0 || recentTerms.length > 0 || hasMistakes) && <section className="grid gap-4 lg:grid-cols-2">
            {weakTermCodes.length > 0 && <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)" }}><div className="flex items-center justify-between"><h2 className="text-base font-semibold">薄弱知识</h2><Link href="/flashcards" className="text-xs hover:underline" style={{ color: "var(--color-accent)" }}>去复习 →</Link></div><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{weakTermCodes.length} 个术语需要加强</p><div className="mt-4 space-y-2">{weakTermCodes.slice(0, 4).map((code) => { const term = tradeTerms.find((item) => item.code === code); return <Link key={code} href={`/terms/${code.toLowerCase()}`} className="flex items-center justify-between text-sm hover:underline"><span><b>{code}</b><span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{term?.chineseName}</span></span><span style={{ color: "var(--color-text-muted)" }}>→</span></Link>; })}</div></div>}
            {recentTerms.length > 0 && <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)" }}><h2 className="text-base font-semibold">最近学习</h2><div className="mt-4 space-y-1">{recentTerms.map(({ term, progress }) => <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-[var(--color-bg-soft)]"><span><b>{term.code}</b><span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{term.chineseName}</span></span><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatRelativeTime(progress.lastReviewed)}</span></Link>)}</div>{hasMistakes && lastSession && <p className="mt-3 border-t pt-3 text-xs" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}>最近实战正确率 {Math.round((lastSession.score / lastSession.total) * 100)}%，{mistakeStats.length} 个薄弱点待巩固。</p>}</div>}
          </section>}

        </div>
      </main>
      <Footer />
    </>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return "刚刚";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}
