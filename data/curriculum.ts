import type { CurriculumPart, SourceRef } from "@/lib/types";

const textbook: SourceRef = {
  label: "黎孝先《国际贸易实务》第七版（2020）",
  url: "https://www.uibep.com/show/book/3644.html",
  version: "第七版",
  updatedAt: "2020",
};

const icc: SourceRef = {
  label: "ICC Incoterms® 2020",
  url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
  version: "Incoterms® 2020",
};

const chapter = (
  number: string,
  title: string,
  description: string,
  status: "available" | "partial" | "planned",
  options: Partial<Pick<import("@/lib/types").CurriculumChapter, "moduleId" | "route" | "learningObjectives" | "prerequisites" | "workflowStages" | "sourceRefs" | "contentPlan" | "practicePlan">> = {}
) => ({
  id: `ch-${number.padStart(2, "0")}`,
  number,
  partId: "part-2" as const,
  title,
  description,
  status,
  learningObjectives: options.learningObjectives ?? ["理解本章核心概念", "能在业务场景中做出正确判断"],
  prerequisites: options.prerequisites ?? [],
  workflowStages: options.workflowStages ?? [],
  sourceRefs: options.sourceRefs ?? [textbook],
  ...options,
});

export const curriculumParts: CurriculumPart[] = [
  {
    id: "intro",
    number: "导论",
    title: "国际贸易实务导论",
    description: "建立外贸业务全流程和学习地图。",
    chapters: [{ ...chapter("00", "导论", "认识国际贸易业务、参与者与基本流程。", "planned", {
      learningObjectives: ["说清一次进出口交易的基本参与者", "能按询盘、报价、签约、履约、结算梳理业务链路"],
      workflowStages: ["询盘", "报价", "合同", "履约", "结算"],
      contentPlan: ["外贸业务全流程地图", "出口商、进口商、银行、承运人和监管方的分工", "国际惯例、合同与强制性法律的边界"],
      practicePlan: ["为一笔小家电出口业务画出时间线", "判断每个参与方在关键节点的责任"],
    }), id: "intro", number: "导论", partId: "intro" }],
  },
  {
    id: "part-1",
    number: "第一篇",
    title: "国际贸易术语",
    description: "理解贸易术语、成本、风险和交付责任。",
    chapters: [
      chapter("01", "贸易术语与国际贸易惯例", "掌握贸易术语的作用、来源、版本和使用边界。", "partial", { route: "/terms", sourceRefs: [textbook, icc], contentPlan: ["术语规则与合同条款的关系", "Incoterms® 2020 与旧版本的选择", "术语不覆盖的事项：所有权、付款和争议解决"], practicePlan: ["为客户询价选择合适的术语", "识别合同中把术语责任绝对化的风险"] }),
      chapter("02", "适用于各种运输方式的贸易术语", "学习EXW、FCA、CPT、CIP、DAP、DPU、DDP。", "available", { moduleId: "incoterms", sourceRefs: [textbook, icc], workflowStages: ["报价", "合同"] }),
      chapter("03", "适用于水上运输方式的贸易术语", "学习FAS、FOB、CFR、CIF及海运场景选择。", "available", { moduleId: "incoterms", sourceRefs: [textbook, icc], workflowStages: ["报价", "装运"] }),
    ],
  },
  {
    id: "part-2",
    number: "第二篇",
    title: "国际货物买卖合同",
    description: "从标的、运输到结算、检验和争议条款建立合同能力。",
    chapters: [
      chapter("04", "合同主体与标的", "明确交易主体、品质、数量和包装要求。", "partial", { moduleId: "contract", route: "/contract/contract-overview", workflowStages: ["询盘", "合同"] }),
      chapter("05", "国际货物运输", "理解运输方式、装运条款和运输单据。", "partial", { moduleId: "transport", route: "/transport/sea-freight", workflowStages: ["履约", "装运"] }),
      chapter("06", "国际货物运输保险", "理解保险责任、险别、金额计算和索赔。", "partial", { moduleId: "insurance", route: "/insurance/cargo-insurance-basics", workflowStages: ["履约", "风险"] }),
      chapter("07", "进出口商品价格", "掌握报价、成本构成和不同术语下的价格换算。", "partial", { route: "/contract/price-clause", workflowStages: ["报价"] }),
      chapter("08", "国际货款收付", "掌握汇付、托收、信用证和贸易融资。", "partial", { moduleId: "settlement", route: "/settlement/settlement-basics", workflowStages: ["结算"] }),
      chapter("09", "进出口商品检验", "掌握检验条款、证书和索赔依据。", "partial", { moduleId: "customs", route: "/customs/inspection-basics", workflowStages: ["履约", "合规"] }),
      chapter("10", "争议预防与处理", "学习索赔、不可抗力、仲裁和争议预防。", "partial", { moduleId: "contract", route: "/contract/dispute-resolution", workflowStages: ["争议"] }),
    ],
  },
  {
    id: "part-3",
    number: "第三篇",
    title: "国际货物买卖合同的商订与履行",
    description: "把谈判、签约和履约连接成完整业务流程。",
    chapters: [
      chapter("11", "国际商务谈判", "学习询盘、报价沟通、谈判策略和商务回复。", "planned", { workflowStages: ["询盘", "谈判"], prerequisites: ["ch-01"], contentPlan: ["询盘、发盘、还盘与接受的沟通边界", "价格、交期、付款和质量条款的谈判顺序", "跨文化沟通与书面留痕"], practicePlan: ["回复一封含糊询盘并补齐关键信息", "针对客户压价写出三轮谈判回复"] }),
      chapter("12", "国际货物买卖合同订立", "掌握发盘、还盘、接受和合同成立。", "partial", { moduleId: "contract", route: "/contract/contract-formation", workflowStages: ["谈判", "合同"] }),
      chapter("13", "进出口合同履行", "按时间线完成备货、报关、装运、制单和收款。", "partial", { moduleId: "documents", route: "/documents/documents-overview", workflowStages: ["履约"] }),
      chapter("14", "违约及法律救济", "区分买卖双方违约责任并选择救济方式。", "partial", { moduleId: "contract", route: "/contract/breach-remedies", workflowStages: ["争议"] }),
    ],
  },
  {
    id: "part-4",
    number: "第四篇",
    title: "国际贸易方式",
    description: "扩展传统贸易、贸易融资和风险管理方式。",
    chapters: [
      chapter("15", "独家经销与独家代理", "比较经销与代理的责任、收益和风险。", "planned", { workflowStages: ["合同", "履约"], prerequisites: ["ch-04"], contentPlan: ["经销与代理的法律关系", "独家区域、最低采购量和业绩条款", "渠道冲突与终止安排"], practicePlan: ["为某区域渠道选择经销或代理", "补写独家合作的三条核心条款"] }),
      chapter("16", "寄售与展卖", "理解寄售、展卖的货权和结算特点。", "planned", { workflowStages: ["履约", "结算"], prerequisites: ["ch-08"], contentPlan: ["货权保留、库存风险与销售回款", "寄售库存和展卖费用的核算", "退货、损耗与保险责任"], practicePlan: ["设计寄售库存对账表", "判断展卖费用由哪一方承担"] }),
      chapter("17", "招标投标与拍卖", "掌握竞价交易流程和文件要求。", "planned", { workflowStages: ["询盘", "合同"], prerequisites: ["ch-11"], contentPlan: ["招标文件、投标保证与评标", "拍卖竞价、成交确认与付款", "合规审查与异常报价识别"], practicePlan: ["从招标文件提取资格和交付要求", "比较两份投标方案的总成本"] }),
      chapter("18", "期货交易与套期保值", "理解价格风险和套期保值基本方法。", "planned", { workflowStages: ["报价", "风险"], prerequisites: ["ch-07"], contentPlan: ["现货价格风险与期货合约", "买入、卖出套期保值的基本逻辑", "基差、保证金与风险限额"], practicePlan: ["为铜材订单选择套保方向", "用简单数据计算套保损益"] }),
      chapter("19", "对销贸易", "认识易货、补偿贸易等对销方式。", "planned", { workflowStages: ["合同", "结算"], prerequisites: ["ch-08"], contentPlan: ["易货、互购和补偿贸易的结构", "对销额度、结算与履约风险", "合同关联条款的交叉违约"], practicePlan: ["画出对销交易的资金与货物流", "识别一项对销安排的合规风险"] }),
      chapter("20", "加工贸易", "理解加工贸易流程、监管和风险。", "planned", { workflowStages: ["履约", "合规"], prerequisites: ["ch-13"], contentPlan: ["来料加工与进料加工", "料件监管、核销和单耗管理", "关务、成本与交付协同"], practicePlan: ["根据订单计算加工贸易单耗", "列出加工贸易交付前的合规检查项"] }),
    ],
  },
  {
    id: "part-5",
    number: "第五篇",
    title: "跨境电子商务",
    description: "连接平台经营、独立站、支付物流与合规。",
    chapters: [
      chapter("21", "跨境电商基本概念", "认识跨境电商生态、参与方和业务边界。", "planned", { workflowStages: ["询盘", "履约", "合规"], prerequisites: ["ch-04"], contentPlan: ["平台、独立站与服务商生态", "B2C、B2B及数字贸易边界", "消费者保护、数据和知识产权风险"], practicePlan: ["为一个产品选择交易模式", "检查商品页是否缺少合规信息"] }),
      chapter("22", "跨境电商模式与运营", "完成选品、定价、履约、售后和合规运营。", "planned", { workflowStages: ["报价", "履约", "结算", "合规"], prerequisites: ["ch-21"], contentPlan: ["选品、定价与平台费用", "支付、国际物流和海外仓", "售后、评价、税务与持续运营"], practicePlan: ["计算一件商品的跨境电商到手成本", "设计从下单到售后的履约清单"] }),
    ],
  },
];

export const curriculumChapters = curriculumParts.flatMap((part) => part.chapters);

export const curriculumStats = {
  parts: curriculumParts.filter((part) => part.id !== "intro").length,
  chapters: curriculumChapters.filter((chapter) => chapter.id !== "intro").length,
  includesIntroduction: true,
  available: curriculumChapters.filter((chapter) => chapter.status === "available").length,
  partial: curriculumChapters.filter((chapter) => chapter.status === "partial").length,
  planned: curriculumChapters.filter((chapter) => chapter.status === "planned").length,
};
