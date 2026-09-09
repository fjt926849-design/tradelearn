"use client";

import { useState } from "react";
import { termLibraryChapters } from "@/data/term-library";
import { tradeTerms } from "@/data/trade-terms";
import ShowcaseCanvas, { showcaseStyles as styles } from "@/components/showcase/ShowcaseCanvas";

type ShowcaseStatus = "new" | "mastered" | "review";

const statusOptions: Array<{ key: ShowcaseStatus; label: string; dot: string }> = [
  { key: "new", label: "未完成", dot: "○" },
  { key: "mastered", label: "已掌握", dot: "●" },
  { key: "review", label: "再看看", dot: "●" },
];

const initialStatuses: Record<string, ShowcaseStatus> = { EXW: "new", FCA: "mastered", CFR: "review", CPT: "mastered" };

function rowClass(status: ShowcaseStatus, active: boolean) {
  if (status === "mastered") return styles.directoryRowMastered;
  if (status === "review") return styles.directoryRowReview;
  return active ? styles.directoryRowActive : "";
}

function statusOptionClass(status: ShowcaseStatus, active: boolean) {
  if (!active) return "";
  return status === "mastered" ? styles.statusOptionMastered : status === "review" ? styles.statusOptionReview : "";
}

export default function ShowcaseStatusPage() {
  const chapter = termLibraryChapters[0];
  const [selectedId, setSelectedId] = useState("FCA");
  const [statuses, setStatuses] = useState<Record<string, ShowcaseStatus>>(initialStatuses);
  const selectedTerm = tradeTerms.find((term) => term.code === selectedId) ?? tradeTerms[0];
  const selectedStatus = statuses[selectedTerm.code] ?? "new";
  const masteredCount = chapter.terms.filter((term) => statuses[term.id] === "mastered").length;

  const chooseStatus = (status: ShowcaseStatus) => {
    setStatuses((previous) => ({ ...previous, [selectedTerm.code]: status }));
  };

  return (
    <ShowcaseCanvas>
      <div className={styles.posterInner}>
        <header className={styles.masthead}>
          <span className={styles.mastheadLabel}>LEARNING STATUS / 02</span>
          <span className={styles.mastheadMeta}><strong>PROGRESS FEEDBACK</strong><span>SHOWCASE</span></span>
        </header>

        <section className={`${styles.intro} ${styles.statusIntro}`}>
          <p className={styles.eyebrow}>STATUS SYNC</p>
          <h1 className={`${styles.title} ${styles.statusTitle}`}>学过什么，{`\n`}一眼就知道。</h1>
          <p className={`${styles.lead} ${styles.statusLead}`}>在术语详情页选择学习状态，左侧术语目录同步反馈。再次进入时，不必重新打开每一张卡片。</p>
        </section>

        <div className={styles.ruleLabel}>INTERACTION PREVIEW / TERM DETAIL</div>
        <section className={styles.statusDemo} aria-label="学习状态同步交互演示">
          <div className={styles.directory}>
            <div className={styles.directoryHead}><div><p className={styles.directoryKicker}>TERM INDEX</p><h2>术语目录</h2></div><span className={styles.directoryCount}>01 / 09</span></div>
            <div className={styles.directoryChapter}>
              <div className={styles.directoryChapterHead}><span className={styles.chapterNumber}>{chapter.number}</span><strong>{chapter.title}</strong><span>{masteredCount} / {chapter.terms.length} 已掌握</span></div>
              <div className={styles.directoryRows}>
                {chapter.terms.slice(0, 7).map((term) => {
                  const status = statuses[term.id] ?? "new";
                  const active = selectedId === term.id;
                  return <button type="button" key={term.id} onClick={() => setSelectedId(term.id)} className={`${styles.directoryRow} ${rowClass(status, active)}`}><span className={`${styles.statusDot} ${status === "mastered" ? styles.statusDotMastered : status === "review" ? styles.statusDotReview : ""}`} /><span className={styles.directoryRowCode}>{term.code}</span><span className={styles.directoryRowName}>{term.name}</span><span className={styles.directoryRowArrow}>↗</span></button>;
                })}
              </div>
            </div>
            <div className={styles.directoryChapterHead} style={{ marginTop: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}><span className={styles.chapterNumber}>02</span><strong>合同</strong><span>0 / 7 已掌握　＋</span></div>
            <div className={styles.directoryChapterHead} style={{ marginTop: 8, border: "1px solid #e5e5e5", borderRadius: 12 }}><span className={styles.chapterNumber}>03</span><strong>运输</strong><span>0 / 6 已掌握　＋</span></div>
          </div>

          <div className={styles.demoDetail}>
            <div className={styles.demoDetailTop}><div><p className={styles.demoDetailKicker}>TERM DETAIL / {selectedTerm.category} GROUP</p><h2>{selectedTerm.code}</h2><p className={styles.demoDetailEnglish}>{selectedTerm.chineseName} · {selectedTerm.fullName}</p></div><span className={styles.demoDetailPage}>02 / 11</span></div>
            <p className={styles.demoSummary}>{selectedTerm.summary}</p>
            <p className={styles.demoStatusLabel}>SELECT LEARNING STATUS</p>
            <div className={styles.statusOptions}>
              {statusOptions.map((option) => <button type="button" key={option.key} onClick={() => chooseStatus(option.key)} aria-pressed={selectedStatus === option.key} className={`${styles.statusOption} ${statusOptionClass(option.key, selectedStatus === option.key)}`}><span>{option.dot}</span>{option.label}</button>)}
            </div>
            <div className={styles.demoContext}><p>{selectedStatus === "mastered" ? "已掌握：回到篇章时，这条术语会以绿色状态保留。" : selectedStatus === "review" ? "再看看：回到篇章时，这条术语会以红色状态提醒。" : "未完成：保持中性灰，等待下一次学习选择。"}</p><p>点击右侧标签，观察左侧 {selectedTerm.code} 行的即时变化。</p></div>
            <div className={styles.syncNote}><div className={styles.syncNoteItem}><span>MARK AS MASTERED</span><strong>目录同步更新</strong></div><div className={styles.syncNoteItem}><span>MARK FOR REVIEW</span><strong>红色状态反馈</strong></div></div>
          </div>
        </section>

        <footer className={styles.foot}><span>TRADELEARN / STATUS SYNC</span><span>GREEN · RED · NEUTRAL</span></footer>
      </div>
    </ShowcaseCanvas>
  );
}
