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

/** 闪卡学习总进度（Incoterms 专用，向后兼容） */
export interface FlashcardProgress {
  terms: Record<string, TermProgress>;
}

/** 通用概念进度存储（可复用至任何知识模块） */
export interface ConceptProgressMap {
  terms: Record<string, TermProgress>;
}

export const defaultConceptProgress: ConceptProgressMap = { terms: {} };

/* ═══════════════════════════ 统一知识模块 ═══════════════════════════ */

export type ModuleId =
  | "incoterms"
  | "settlement"
  | "transport"
  | "insurance"
  | "documents"
  | "customs"
  | "contract";

/** 教材课程的篇章层级（第七版五篇二十二章） */
export type CurriculumPartId = "intro" | "part-1" | "part-2" | "part-3" | "part-4" | "part-5";

export type CurriculumStatus = "available" | "partial" | "planned";

export interface SourceRef {
  label: string;
  url?: string;
  version?: string;
  updatedAt?: string;
}

export interface CurriculumChapter {
  id: string;
  number: string;
  partId: CurriculumPartId;
  title: string;
  description: string;
  status: CurriculumStatus;
  route?: string;
  moduleId?: ModuleId;
  learningObjectives: string[];
  prerequisites: string[];
  workflowStages: string[];
  sourceRefs: SourceRef[];
  /** 规划章节的交付范围；已开放章节也可用来解释学习路径。 */
  contentPlan?: string[];
  /** 规划中的操作型练习，避免“建设中”页面只有一句空状态。 */
  practicePlan?: string[];
}

export interface CurriculumPart {
  id: CurriculumPartId;
  number: string;
  title: string;
  description: string;
  chapters: CurriculumChapter[];
}

/** 章节微课的第一版内容单元，独立于教材原文。 */
export interface CurriculumLesson {
  chapterId: string;
  overview: string;
  keyPoints: { title: string; detail: string }[];
  caseStudy: { title: string; context: string; prompt: string; takeaway: string };
  check: { question: string; options: string[]; answerIndex: number; explanation: string };
  task: string;
}

export const MODULE_LABELS: Record<ModuleId, string> = {
  incoterms: "贸易术语",
  settlement: "国际结算",
  transport: "国际运输",
  insurance: "货运保险",
  documents: "进出口单据",
  customs: "报关与检验",
  contract: "合同条款",
};

/** 模块章节编号 + 英文标识（Trade Manual 编号系统，替代 emoji 图标） */
export const MODULE_CHAPTERS: Record<ModuleId, { no: string; en: string }> = {
  incoterms:  { no: "01", en: "TERMS" },
  settlement: { no: "02", en: "PAYMENT" },
  transport:  { no: "03", en: "SHIPPING" },
  insurance:  { no: "04", en: "INSURANCE" },
  documents:  { no: "05", en: "DOCUMENTS" },
  customs:    { no: "06", en: "CUSTOMS" },
  contract:   { no: "07", en: "CONTRACT" },
};

export const MODULE_ROUTES: Record<ModuleId, string> = {
  incoterms: "/terms",
  settlement: "/settlement",
  transport: "/transport",
  insurance: "/insurance",
  documents: "/documents",
  customs: "/customs",
  contract: "/contract",
};

/** 统一概念对比 */
export interface ConceptComparison {
  conceptId: string;
  title: string;
  differences: string[];
}

/* ═══════════════════════════ 国际结算 ═══════════════════════════ */

export type SettlementCategory = "payment-method" | "document" | "basics" | "trade-finance" | "lc-detail";

export interface SettlementProcessStep {
  order: number;
  actor: "exporter" | "importer" | "exporter-bank" | "importer-bank" | "carrier";
  actorLabel: string;
  action: string;
  documents?: string[];
}

export interface SettlementParty {
  role: string;
  englishRole: string;
  who: "exporter-side" | "importer-side" | "bank";
  description: string;
}

export interface SettlementConcept {
  id: string;
  module: ModuleId;
  title: string;
  englishTitle: string;
  category: string;
  summary: string;
  description: string;
  keyFeatures: string[];
  processSteps?: SettlementProcessStep[];
  parties?: SettlementParty[];
  commonMisunderstandings: string[];
  comparisons: ConceptComparison[];
  relatedIncotermCodes: string[];
  relatedConceptIds: string[];
}

/* ═══════════════════════════ 通用知识概念 ═══════════════════════════ */

/** 非 Incoterms / Settlement 的其他模块使用此通用类型 */
export interface KnowledgeConcept {
  id: string;
  module: ModuleId;
  title: string;
  englishTitle: string;
  category: string;
  summary: string;
  description: string;
  keyFeatures: string[];
  commonMisunderstandings: string[];
  comparisons: ConceptComparison[];
  relatedConceptIds: string[];
  relatedIncotermCodes: string[];
}

/* ═══════════════════════════ 通用场景题 ═══════════════════════════ */

export interface GenericScenarioOption {
  id: string;
  label: string;
}

export interface GenericScenarioQuestion {
  id: string;
  module: ModuleId;
  scenario: string;
  question: string;
  options: GenericScenarioOption[];
  correctIndex: number;
  explanation: string;
  knowledgePoints: string[];
  commonMistake: string;
  relatedConceptIds: string[];
}

/* ═══════════════════════════ 综合实战 ═══════════════════════════ */

export interface ComprehensiveStep {
  id: string;
  step: number;
  title: string;
  description: string;
  module: ModuleId;
  options: GenericScenarioOption[];
  correctIndex: number;
  explanation: string;
}

export interface ComprehensiveResult {
  steps: {
    stepId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  score: number;
  total: number;
  weakModules: ModuleId[];
  recommendations: string[];
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
