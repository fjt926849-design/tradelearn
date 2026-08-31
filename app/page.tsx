"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";
import { curriculumChapters, curriculumParts } from "@/data/curriculum";
import { getCurriculumLesson } from "@/data/curriculum-lessons";
import { tradeTerms } from "@/data/trade-terms";

const ALL_CODES = tradeTerms.map((term) => term.code);

const PRACTICE_ENTRIES = [
  { href: "/practice/incoterms", label: "报价实训", description: "根据交付场景选择贸易术语" },
  { href: "/practice/contract", label: "合同实训", description: "补齐条款并判断履约风险" },
  { href: "/practice/comprehensive", label: "综合业务模拟", description: "从询盘到结算完成一笔业务" },
];

const DOMAIN_ENTRIES = [
  { href: "/terms", number: "01", label: "贸易术语", en: "TERMS" },
  { href: "/settlement", number: "02", label: "国际结算", en: "PAYMENT" },
  { href: "/transport", number: "03", label: "国际运输", en: "SHIPPING" },
  { href: "/insurance", number: "04", label: "货运保险", en: "INSURANCE" },
  { href: "/documents", number: "05", label: "进出口单据", en: "DOCUMENTS" },
  { href: "/customs", number: "06", label: "报关与检验", en: "CUSTOMS" },
  { href: "/contract", number: "07", label: "合同条款", en: "CONTRACT" },
];

export default function HomePage() {
  const { aggregated } = useProgressAggregator();
  const { getWeakTermCodes, getTermProgress, getNextReviewInfo } = useFlashcardProgress();
  const { hasMistakes, lastSession, getMistakeStats } = usePracticeProgress();
  const { chapterProgress, currentChapter, completedCount, totalStudySeconds, hydrated } = useCurriculumProgress();

  const weakTermCodes = getWeakTermCodes(ALL_CODES);
  const nextReviewInfo = getNextReviewInfo(ALL_CODES);
  const recentTerms = tradeTerms
    .map((term) => ({ term, progress: getTermProgress(term.code) }))
    .filter(({ progress }) => progress.lastReviewed > 0)
    .sort((a, b) => b.progress.lastReviewed - a.progress.lastReviewed)
    .slice(0, 3);

  const currentProgress = currentChapter ? chapterProgress[currentChapter.id] : undefined;
  const currentOrdinal = currentChapter ? curriculumChapters.findIndex((chapter) => chapter.id === currentChapter.id) + 1 : 1;
  const currentPart = currentChapter ? curriculumParts.find((part) => part.id === currentChapter.partId) : undefined;
  const currentChapterHref = currentChapter && getCurriculumLesson(currentChapter.id)
    ? `/knowledge-map/chapter/${currentChapter.id}`
    : currentChapter?.route ?? `/knowledge-map/chapter/${currentChapter?.id ?? "intro"}`;
  const allChaptersCompleted = completedCount === curriculumChapters.length;
  const heroHref = allChaptersCompleted ? "/knowledge-map" : currentProgress?.progress ? currentChapterHref : "/start";
  const heroLabel = allChaptersCompleted ? "开始复习" : currentProgress?.progress ? "继续学习" : "从零开始";
  const currentPracticeHref = currentChapter && getCurriculumLesson(currentChapter.id)
    ? `/knowledge-map/chapter/${currentChapter.id}/practice`
    : currentChapterHref;
  const checkpointReady = curriculumChapters.filter((chapter) => {
    const progress = chapterProgress[chapter.id];
    return progress && progress.status !== "completed" && progress.progress >= 60;
  }).length;
  const totalStudyMinutes = Math.floor(totalStudySeconds / 60);
  const mistakeStats = getMistakeStats();
  const reviewDueCount = Math.max(0, aggregated.totalDue - aggregated.totalNew);
  const learningChapterCount = curriculumChapters.filter((chapter) => chapterProgress[chapter.id]?.status === "learning").length;
  const chapterProgressPercent = curriculumChapters.length
    ? Math.round(curriculumChapters.reduce((sum, chapter) => sum + (chapterProgress[chapter.id]?.progress ?? 0), 0) / curriculumChapters.length)
    : 0;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero
          totalConcepts={aggregated.totalConcepts}
          totalMastered={aggregated.totalMastered}
          overallProgress={aggregated.overallProgress}
          primaryHref={hydrated ? heroHref : "/start"}
          primaryLabel={hydrated ? heroLabel : "加载进度…"}
        />
        <section className="border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-stretch">
              <div className="rounded-xl border p-6 sm:p-8" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>学习仪表盘 · TRADELEARN</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">继续你的外贸学习</h1>
                <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>从一个章节开始，把术语、合同、装运、结算和实战串成一条清晰的业务路径。</p>

                <div className="mt-7 rounded-lg border p-4 sm:p-5" style={{ borderColor: "var(--color-border-light)", background: "var(--color-bg-soft)" }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>当前学习章节 · {currentOrdinal} / {curriculumChapters.length}</p>
                      <h2 className="mt-1 truncate text-lg font-semibold">{allChaptersCompleted ? "全部章节已完成" : currentChapter?.title ?? "国际贸易实务导论"}</h2>
                      <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>{allChaptersCompleted ? "可以开始综合复习或挑战业务实战。" : currentChapter?.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}>{currentProgress?.progress ?? 0}%</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full" style={{ width: `${currentProgress?.progress ?? 0}%`, background: "var(--color-accent)" }} /></div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{allChaptersCompleted ? "所有章节和检测均已完成" : currentProgress?.lastOpenedAt ? `上次学习：${formatRelativeTime(currentProgress.lastOpenedAt)}` : "还没有开始学习，从第一课开始即可"}</p>
                    <Link href={allChaptersCompleted ? "/knowledge-map" : currentChapterHref} className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--color-accent)" }}>{allChaptersCompleted ? "开始复习" : currentProgress?.progress ? "继续学习" : "开始第一课"} <span aria-hidden="true" className="ml-1">→</span></Link>
                  </div>
                </div>
              </div>

              <aside className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }} aria-label="学习概览">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>课程进度</p><p className="mt-2 text-3xl font-semibold tabular-nums">{chapterProgressPercent}%</p></div><span className="rounded-lg px-2 py-1 text-xs" style={{ color: allChaptersCompleted ? "var(--color-status-mastered)" : "var(--color-accent)", background: "var(--color-accent-soft)" }}>{allChaptersCompleted ? "已完成" : "学习中"}</span></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full" style={{ width: `${chapterProgressPercent}%`, background: "var(--color-accent)" }} /></div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: "var(--color-border-light)" }}><div><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>已完成</p><p className="mt-1 text-xl font-semibold tabular-nums">{completedCount}<span className="ml-1 text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>章</span></p></div><div><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>学习中</p><p className="mt-1 text-xl font-semibold tabular-nums">{learningChapterCount}<span className="ml-1 text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>章</span></p></div><div><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>累计学习</p><p className="mt-1 text-xl font-semibold tabular-nums">{totalStudyMinutes}<span className="ml-1 text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>分</span></p></div></div>
                <p className="mt-5 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>建议每日学习 15—20 分钟，完成一节微课再做章节检测。</p>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-10 px-5 py-10">
          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">今日任务</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>用 15—20 分钟完成一次小闭环。</p></div><Link href="/progress" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>查看我的进度 →</Link></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Link href="/flashcards" className="rounded-xl border p-4 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>待复习知识点</p><p className="mt-2 text-2xl font-semibold tabular-nums">{reviewDueCount}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>{aggregated.totalNew} 个新知识点等待学习</p></Link>
              <Link href={checkpointReady > 0 ? currentPracticeHref : currentChapterHref} className="rounded-xl border p-4 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>待完成章节检测</p><p className="mt-2 text-2xl font-semibold tabular-nums">{checkpointReady}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>{checkpointReady > 0 ? "完成检测即可推进章节" : "先完成微课，再进行检测"}</p></Link>
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>今日建议</p><p className="mt-2 text-2xl font-semibold">15—20<span className="ml-1 text-sm font-normal">分钟</span></p><p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>{nextReviewInfo.timestamp ? `下一次复习：${nextReviewInfo.label}` : "完成一节微课，建立学习节奏"}</p></div>
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">课程总览</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>五篇课程，按教材顺序逐步掌握。</p></div><Link href="/knowledge-map" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>进入完整课程 →</Link></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{curriculumParts.filter((part) => part.id !== "intro").map((part) => { const views = part.chapters.map((chapter) => chapterProgress[chapter.id]); const completed = views.filter((view) => view?.status === "completed").length; const percent = views.length ? Math.round(views.reduce((sum, view) => sum + (view?.progress ?? 0), 0) / views.length) : 0; const isCurrent = currentPart?.id === part.id; return <Link key={part.id} href="/knowledge-map" className="rounded-xl border p-4 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: isCurrent ? "var(--color-accent)" : "var(--color-border)", background: isCurrent ? "var(--color-accent-soft)" : "var(--color-surface)" }}><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold" style={{ color: isCurrent ? "var(--color-accent)" : "var(--color-text-muted)" }}>{part.number}</span><span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{completed}/{views.length}</span></div><p className="mt-3 text-sm font-medium">{part.title}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full" style={{ width: `${percent}%`, background: "var(--color-accent)" }} /></div><p className="mt-2 text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{percent}% 完成</p></Link>; })}</div>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">业务实战</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>把刚学的知识放进真实业务场景。</p></div><Link href="/practice" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>查看全部实战 →</Link></div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{PRACTICE_ENTRIES.map((entry, index) => <Link key={entry.href} href={entry.href} className="group rounded-xl border p-5 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><div className="flex items-center justify-between"><span className="text-xs font-semibold tabular-nums" style={{ color: "var(--color-accent)" }}>0{index + 1}</span><span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--color-text-muted)" }}>→</span></div><p className="mt-6 text-base font-semibold">{entry.label}</p><p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>{entry.description}</p></Link>)}</div>
          </section>

          {(weakTermCodes.length > 0 || recentTerms.length > 0 || hasMistakes) ? <section className="grid gap-4 lg:grid-cols-2">
            {weakTermCodes.length > 0 && <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)" }}><div className="flex items-center justify-between"><h2 className="text-base font-semibold">薄弱知识</h2><Link href="/flashcards" className="text-xs hover:underline" style={{ color: "var(--color-accent)" }}>去复习 →</Link></div><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{weakTermCodes.length} 个术语需要加强</p><div className="mt-4 space-y-2">{weakTermCodes.slice(0, 4).map((code) => { const term = tradeTerms.find((item) => item.code === code); return <Link key={code} href={`/terms/${code.toLowerCase()}`} className="flex items-center justify-between text-sm hover:underline"><span><b>{code}</b><span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{term?.chineseName}</span></span><span style={{ color: "var(--color-text-muted)" }}>→</span></Link>; })}</div></div>}
            {recentTerms.length > 0 && <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)" }}><h2 className="text-base font-semibold">最近学习</h2><div className="mt-4 space-y-1">{recentTerms.map(({ term, progress }) => <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-[var(--color-bg-soft)]"><span><b>{term.code}</b><span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{term.chineseName}</span></span><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatRelativeTime(progress.lastReviewed)}</span></Link>)}</div>{hasMistakes && lastSession && <p className="mt-3 border-t pt-3 text-xs" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}>最近实战正确率 {Math.round((lastSession.score / lastSession.total) * 100)}%，{mistakeStats.length} 个薄弱点待巩固。</p>}</div>}
          </section> : <section className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}><p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-accent)" }}>WELCOME · 新用户引导</p><h2 className="mt-2 text-lg font-semibold">从第一课开始建立你的外贸知识体系</h2><p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>先完成导论，再学习贸易术语，最后用报价和合同实战检验理解。每次学习都会自动记录进度。</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/start" className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>开始诊断</Link><Link href="/knowledge-map" className="rounded-md border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)" }}>查看课程地图</Link></div></section>}

          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">知识模块</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>需要查找具体知识点时，从这里快速进入。</p></div><Link href="/knowledge-map" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>课程地图 →</Link></div>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4 lg:grid-cols-7" style={{ borderColor: "var(--color-border)" }}>{DOMAIN_ENTRIES.map((entry) => <Link key={entry.href} href={entry.href} className="p-4 text-center transition-colors hover:bg-[var(--color-bg-soft)]" style={{ background: "var(--color-surface)" }}><span className="text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{entry.number}</span><p className="mt-2 text-xs font-medium">{entry.label}</p><p className="mt-1 text-[10px] tracking-[0.12em]" style={{ color: "var(--color-text-muted)" }}>{entry.en}</p></Link>)}</div>
          </section>
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
