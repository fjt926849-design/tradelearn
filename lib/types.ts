/** 学习状态（存储值） */
export type LearnStatus = "new" | "learning" | "familiar" | "mastered";

/** 学习状态显示 meta */
export const STATUS_META: Record<
  LearnStatus,
  { label: string; dot: string; color: string }
> = {
  mastered:  { label: "已掌握", dot: "●", color: "var(--color-status-mastered)" },
  familiar:  { label: "已掌握", dot: "●", color: "var(--color-status-mastered)" },
  learning:  { label: "学习中", dot: "◉", color: "var(--color-status-learning)" },
  new:       { label: "未开始", dot: "○", color: "var(--color-status-new)" },
};

/** 闪卡自评结果（用户操作的四档） */
export type SelfRating = "forgot" | "blurry" | "got-it" | "mastered";

export const RATING_LABELS: Record<SelfRating, string> = {
  forgot:   "不会",
  blurry:   "模糊",
  "got-it": "会",
  mastered: "很熟",
};

/** 间隔复习规则 */
export interface IntervalRule {
  interval: number;       // ms
  status: LearnStatus;    // 存储状态
}

export const INTERVAL_RULES: Record<SelfRating, IntervalRule> = {
  forgot:   { interval: 10 * 60 * 1000,            status: "learning" },   // 10 分钟
  blurry:   { interval: 24 * 60 * 60 * 1000,        status: "learning" },   // 1 天
  "got-it": { interval: 3 * 24 * 60 * 60 * 1000,    status: "familiar" },   // 3 天
  mastered: { interval: 7 * 24 * 60 * 60 * 1000,    status: "mastered" },   // 7 天
};

/** 计算下次复习时间和间隔 */
export function calcNextReview(
  rating: SelfRating,
  currentInterval: number
): { nextReviewAt: number; interval: number; status: LearnStatus } {
  const rule = INTERVAL_RULES[rating];

  // 如果用户升级/保持掌握：在基础间隔上逐步增加
  let interval: number;
  if (rating === "got-it" || rating === "mastered") {
    // 双倍递增，首次用基础间隔
    interval = currentInterval > 0 ? currentInterval * 2 : rule.interval;
    // 上限 60 天
    if (interval > 60 * 24 * 60 * 60 * 1000) {
      interval = 60 * 24 * 60 * 60 * 1000;
    }
  } else {
    // 不会/模糊：重置为基础间隔
    interval = rule.interval;
  }

  return {
    nextReviewAt: Date.now() + interval,
    interval,
    status: rule.status,
  };
}

/** 相近术语对比 */
export interface SimilarTermDiff {
  term: string;   // 对比的术语代码
  diff: string;   // 关键区别说明
}

/** Incoterms 2020 贸易术语 */
export interface TradeTerm {
  code: string;
  fullName: string;
  chineseName: string;
  category: "E" | "F" | "C" | "D";
  categoryLabel: string;
  icon: string;
  summary: string;
  description: string;
  sellerObligations: string[];
  buyerObligations: string[];
  riskTransferPoint: string;
  transportMode: string[];
  timeline: TimelineStep[];
  keyPoint: string;
  /** 初学者最容易犯的误解 */
  commonMisunderstandings: string[];
  /** 与相近术语的关键区别 */
  similarTermDiffs: SimilarTermDiff[];
}

export interface TimelineStep {
  step: string;
  responsible: "seller" | "buyer" | "both";
}

/** 知识地图节点 */
export interface KnowledgeMapNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  isPlaceholder: boolean;
  children?: KnowledgeMapNode[];
}

/** 单个术语学习进度 */
export interface TermProgress {
  termCode: string;
  status: LearnStatus;
  lastReviewed: number;
  reviewCount: number;
  nextReviewAt: number;  // 下次复习到期时间 (timestamp, 0 = immediate / 未设置)
  interval: number;       // 当前间隔 (ms, 0 = 未设置)
}

/** 闪卡学习总进度 */
export interface FlashcardProgress {
  terms: Record<string, TermProgress>;
}

/* ═══════════════════════════ 场景实战 ═══════════════════════════ */

/** 场景题选项 */
export interface ScenarioOption {
  code: string;    // 术语代码，如 "FOB"
  label: string;   // 显示文本，如 "FOB — 装运港船上交货"
}

/** 场景题 */
export interface ScenarioQuestion {
  id: string;
  scenario: string;           // 外贸业务背景
  question: string;           // 需要用户做出的业务判断
  options: ScenarioOption[];  // 3-4 个选项
  correctIndex: number;       // 正确选项的索引
  explanation: string;        // 答案解释
  knowledgePoints: string[];  // 涉及的核心知识点
  commonMistake: string;      // 易错点
  /** 涉及的术语代码，用于关联闪卡复习 */
  relatedTermCodes: string[];
}

/** 单次答题记录 */
export interface PracticeAttempt {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timestamp: number;
}

/** 一次完整的实战会话 */
export interface PracticeSession {
  date: number;
  score: number;
  total: number;
  /** 答错的术语代码（去重） */
  mistakeTermCodes: string[];
}

/** 场景实战总进度 */
export interface PracticeProgress {
  attempts: Record<string, PracticeAttempt[]>;
  sessions: PracticeSession[];
}
