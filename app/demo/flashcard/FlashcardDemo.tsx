"use client";

import { useState } from "react";
import styles from "./flashcard.module.css";

type Rating = "forgot" | "blurry" | "got-it" | "mastered";

const ratingOptions: Array<{ value: Rating; label: string; detail: string }> = [
  { value: "forgot", label: "不会", detail: "需要重新学习" },
  { value: "blurry", label: "模糊", detail: "明天再复习" },
  { value: "got-it", label: "会", detail: "已经掌握" },
  { value: "mastered", label: "很熟", detail: "可以拉长间隔" },
];

export default function FlashcardDemo() {
  const [flipped, setFlipped] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);

  const handleFlip = () => {
    if (!rating) setFlipped((current) => !current);
  };

  const handleRating = (nextRating: Rating) => {
    setRating(nextRating);
  };

  return (
    <main className={styles.demoPage}>
      <section className={styles.demoFrame} aria-label="TradeLearn Flashcard 组件演示">
        <header className={styles.demoHeader}>
          <div className={styles.brandLockup}>
            <span className={styles.brandMark} aria-hidden="true">贸</span>
            <span>
              <strong>TradeLearn</strong>
              <small>FLASHCARD COMPONENT</small>
            </span>
          </div>
          <span className={styles.demoIndex}>DEMO / 01</span>
        </header>

        <div className={styles.introRow}>
          <div>
            <p className={styles.eyebrow}>INCOTERMS 2020 · TERM REVIEW</p>
            <h1>把一个术语，记得更久。</h1>
          </div>
          <div className={styles.progressMeta}>
            <span>本轮进度</span>
            <strong>01 <i>/</i> 01</strong>
          </div>
        </div>

        <div className={styles.progressTrack} aria-label="本轮进度 1 / 1">
          <span />
        </div>

        <div className={styles.cardStage}>
          <button
            type="button"
            className={`${styles.cardButton} ${flipped ? styles.isFlipped : ""}`}
            onClick={handleFlip}
            aria-label={flipped ? "点击翻回正面" : "点击翻转查看答案"}
            aria-pressed={flipped}
          >
            <span className={styles.cardInner}>
              <span className={`${styles.cardFace} ${styles.cardFront}`} aria-hidden={flipped}>
                <span className={styles.cardTopline}>
                  <span className={styles.cardKicker}>贸易术语 · 主运费未付</span>
                  <span className={styles.cardNumber}>01 / 01</span>
                </span>
                <span className={styles.frontContent}>
                  <span className={styles.termCode}>FOB</span>
                  <span className={styles.termName}>装运港船上交货</span>
                  <span className={styles.termEnglish}>Free On Board</span>
                </span>
                <span className={styles.cardBottomline}>
                  <span className={styles.modePill}>海运 / 内河水运</span>
                  <span className={styles.flipHint}>点击卡片查看释义 <b>↗</b></span>
                </span>
              </span>

              <span className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
                <span className={styles.cardTopline}>
                  <span className={styles.cardKicker}>一句话理解</span>
                  <span className={styles.answerLabel}>ANSWER</span>
                </span>
                <span className={styles.backContent}>
                  <span className={styles.backTerm}>装运港船上交货</span>
                  <span className={styles.backSummary}>
                    卖方将货物装上买方指定的船舶，货物装船后风险转移给买方。
                  </span>
                  <span className={styles.factGrid}>
                    <span><small>交货地点</small><strong>装运港</strong></span>
                    <span><small>风险转移</small><strong>装上船时</strong></span>
                  </span>
                </span>
                <span className={styles.cardBottomline}>
                  <span className={styles.modePill}>FOB · 仅限水运</span>
                  <span className={styles.flipHint}>点击卡片翻回 <b>↙</b></span>
                </span>
              </span>
            </span>
          </button>

          <div className={`${styles.ratingPanel} ${flipped ? styles.ratingVisible : ""}`} aria-live="polite">
            <div className={styles.ratingHeading}>
              <span>看完释义后选择掌握程度</span>
              <span className={styles.ratingRule}>自我评估</span>
            </div>
            <div className={styles.ratingOptions}>
              {ratingOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`${styles.ratingButton} ${rating === option.value ? styles.isSelected : ""}`}
                  data-rating={option.value}
                  onClick={() => handleRating(option.value)}
                  disabled={!flipped}
                  aria-pressed={rating === option.value}
                >
                  <span className={styles.ratingDot} />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                  </span>
                </button>
              ))}
            </div>
            {rating === "blurry" && (
              <div className={styles.reviewNotice}>
                <span className={styles.calendarIcon} aria-hidden="true">↻</span>
                <span><strong>下次复习：明天</strong><small>已加入你的复习队列</small></span>
                <span className={styles.noticeCheck} aria-hidden="true">✓</span>
              </div>
            )}
          </div>
        </div>

        <footer className={styles.demoFooter}>
          <span>按记忆曲线复习 · 一次只专注一张卡片</span>
          <span>FOB / 01</span>
        </footer>
      </section>
    </main>
  );
}
