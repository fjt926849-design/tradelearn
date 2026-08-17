"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { ModuleId } from "@/lib/types";

/* ═══════════════════════ 综合实战模拟数据 ═══════════════════════ */

interface CompStep {
  id: string;
  step: number;
  title: string;
  module: ModuleId;
  moduleLabel: string;
  scenario: string;
  question: string;
  options: { id: string; label: string }[];
  correctIndex: number;
  explanation: string;
  knowledgePoint: string;
}

const STEPS: CompStep[] = [
  {
    id: "comp-term",
    step: 1,
    title: "选择贸易术语",
    module: "incoterms",
    moduleLabel: "贸易术语",
    scenario:
      "你是一家深圳电子制造商的业务经理。一位德国新客户发来询价：采购一批蓝牙耳机（货值约$60,000），客户在汉堡有长期合作的货代和报关行，但希望由卖方安排国际运输（客户不想参与运输操作的复杂性）。货物将用集装箱从深圳盐田港海运到汉堡。",
    question: "在以下贸易术语中，哪个最适合这个场景？",
    options: [
      { id: "a", label: "EXW Shenzhen — 买方自己到工厂提货并负责所有出口和运输手续" },
      { id: "b", label: "FOB Shenzhen — 卖方负责出口报关+装船，买方安排海运和保险" },
      { id: "c", label: "CIF Hamburg — 卖方负责出口报关+海运+保险到汉堡，买方负责目的港清关和内陆运输" },
      { id: "d", label: "DDP Hamburg — 卖方负责一切直到送货上门含进口清关和关税" },
    ],
    correctIndex: 2,
    explanation:
      "客户希望卖方安排运输但又不想参与太多——CIF是最佳平衡：卖方负责从工厂到汉堡港的全部运输和保险（满足了客户「你帮我安排运输」的期望），而买方只需在汉堡港接收货物并办理进口清关（客户在汉堡有团队可以轻松做到）。DDP让卖方承担太多（需要在德国有税务实体办进口报关），EXW给了买方太多负担（与中国工厂预期不符），FOB让买方安排海运（不是客户期望的）。",
    knowledgePoint: "CIF 是卖方负责国际运输到目的港、买方负责进口清关的平衡术语",
  },
  {
    id: "comp-payment",
    step: 2,
    title: "选择付款方式",
    module: "settlement",
    moduleLabel: "国际结算",
    scenario:
      "这是你们与该德国客户的首次交易。客户在德国是一家信誉良好的中型电子产品分销商（可查到信用报告），但与你们没有交易历史。订单金额$60,000，生产周期约30天，海运约35天。你们需要既能保护收款安全、又不吓跑新客户的结算方案。",
    question: "最适合这个首单场景的结算安排是？",
    options: [
      { id: "a", label: "100% T/T 预付——最安全" },
      { id: "b", label: "100% 即期L/C——银行信用最可靠" },
      { id: "c", label: "O/A 60天——给客户最大的付款灵活度" },
      { id: "d", label: "30% T/T 预付（开工）+ 70% 见提单复印件付（发货后）——在收款安全和客户接受度之间取得平衡" },
    ],
    correctIndex: 3,
    explanation:
      "对于信誉良好但首次合作的买方，30%预付+70%见提单付是业内最常见的平衡方案。30%预付覆盖卖方的生产成本（万一买方取消订单不至于全部亏损），70%见提单付给卖方在发货后一定程度的收款信心（买方不付尾款前拿不到提单提不了货）。100%预付买方几乎不可能接受；100% L/C虽然最安全但给新客户增加了银行授信成本和操作复杂度；O/A 60天给新客户风险过高。",
    knowledgePoint: "首次交易：30%预付+70%见提单付 = 安全与接受度的最佳平衡",
  },
  {
    id: "comp-transport",
    step: 3,
    title: "选择运输方式",
    module: "transport",
    moduleLabel: "国际运输",
    scenario:
      "货物约28m³——刚好装满一个20GP集装箱。深圳到汉堡的海运时间约30-35天，空运约3-4天但费用是海运的10倍。交期还有55天——海运完全来得及。货物是蓝牙耳机（非危险品、非常规温控需求）。",
    question: "最合理的运输安排是？",
    options: [
      { id: "a", label: "空运——最快最安全" },
      { id: "b", label: "中欧班列铁路——时效和成本的折中" },
      { id: "c", label: "20GP整箱海运（FCL）——成本最低、28m³刚好满箱、时效满足交期" },
      { id: "d", label: "LCL拼箱——货量不够整箱" },
    ],
    correctIndex: 2,
    explanation:
      "28m³刚好装满一个20GP集装箱——这是FCL最理想的场景。FCL比LCL不仅便宜（按箱计费<按方计费），而且更安全（全程不与其他货物混合）和更高效（不等拼箱）。海运30-35天在55天交期内完全来得及。空运毫无必要——浪费10倍运费。铁路在这个场景中不如海运有成本优势。",
    knowledgePoint: "约28m³ = 一个20GP的完美装载量——FCL比LCL更经济安全",
  },
  {
    id: "comp-insurance",
    step: 4,
    title: "安排货运保险",
    module: "insurance",
    moduleLabel: "货运保险",
    scenario:
      "你以CIF Hamburg报价——因此你有义务为买方购买海运保险。蓝牙耳机货值$60,000，海运费$1,800，预估保险费率0.3%。客户在合同中没有特别约定保险级别。",
    question: "你应该为这批货物购买什么级别的保险？",
    options: [
      { id: "a", label: "ICC C（最低基本险）——满足CIF最低法律义务，保费最低" },
      { id: "b", label: "ICC A（一切险）——保费略高但覆盖最全面，保护电子产品的实际风险" },
      { id: "c", label: "不买保险——让买方自己买" },
      { id: "d", label: "只买战争险——海盗风险是主要担心" },
    ],
    correctIndex: 1,
    explanation:
      "虽然CIF法律上只要求ICC C——但ICC C只覆盖船舶沉没、火灾等极端事故，对电子产品最常见的风险（集装箱汗水凝结导致变霉、装卸过程中的碰撞和跌落）却不保。作为重视商誉的卖方，购买ICC A保护买方的真实利益——这多出的保费很小（保险费≈$61,800×110%×0.3%≈$204），但体现了专业性。而且如果货物受损而保险不赔——买方虽不能找你「索赔」（风险已转移），但可能再也不找你「下单」。正确的做法是在合同中也注明「Insurance: ICC (A) / All Risks」以避免买方预期与卖方行为之间的落差。",
    knowledgePoint: "CIF最低要求ICC C，但实务中为保护买方利益和商誉应选择ICC A",
  },
  {
    id: "comp-documents",
    step: 5,
    title: "准备贸易单据",
    module: "documents",
    moduleLabel: "进出口单据",
    scenario:
      "你通过银行交单（L/C场景下）需要提交全套单据。你需要准备：商业发票、装箱单、海运提单、保险单、原产地证。在审核单据时，你发现提单上的装运日期是「2026-03-14」，保险单上的出具日期是「2026-03-18」——比提单晚了4天。",
    question: "这个日期差会导致银行拒付吗？",
    options: [
      { id: "a", label: "会——保险单日期必须在装运日之前或同天" },
      { id: "b", label: "可能不会——如果保险单上注明「保险责任从2026-03-14起生效」，即使出具日期晚于装运日，银行也可以接受" },
      { id: "c", label: "一定会拒付——任何日期差异都是不符点" },
      { id: "d", label: "这取决于开证行的严格程度" },
    ],
    correctIndex: 1,
    explanation:
      "UCP 600第28条e款规定：「保险单据日期不得晚于装运日期，除非保险单据显示保险责任不迟于装运日生效」。这意味着如果你的保险单虽然在装运后2天才出具，但保单上有一个条款或批注写明「Cover effective from 2026-03-14」（保险从装运日起覆盖）——银行应接受。这提醒我们：让保险公司/保险经纪人在保单上加入「保险责任从装运日起生效」的声明是一个有用的小技巧，可以防止因保险出具晚于装运而产生的不符点。不过最好的做法还是提前安排好保险——在发货前就拿到保单。",
    knowledgePoint: "保险单出具晚于装运日不一定被拒——只要保单上注明保险责任从装运日起生效",
  },
  {
    id: "comp-customs",
    step: 6,
    title: "报关与检验",
    module: "customs",
    moduleLabel: "报关与检验",
    scenario:
      "你准备向海关申报出口。你的蓝牙耳机产品使用的是纸盒包装（内盒）+外纸箱。没有木质托盘——全部是纸箱。产品HS编码是8518.30（耳机类）。产品的出口退税率为13%（大部分电子产品享受此退税率）。【需人工审核：具体退税率以国家税务总局最新公告为准。】",
    question: "以下哪个关于此批货物出口报关的判断是正确的？",
    options: [
      { id: "a", label: "CIF术语下出口报关由买方负责" },
      { id: "b", label: "CIF术语下出口报关由卖方负责，且纸质包装无需考虑ISPM 15检验检疫" },
      { id: "c", label: "全部电子产品都是0关税出口" },
      { id: "d", label: "纸箱也需要ISPM 15处理" },
    ],
    correctIndex: 1,
    explanation:
      "CIF下出口报关由卖方负责（Incoterms中除了EXW由买方负责出口报关外，其余10个术语均由卖方负责出口报关）。纸箱（非实木）不需要ISPM 15植物检疫处理——只有天然实木包装（木托盘、木箱、木框架等——胶合板和人造板材除外）才需要。ISPM 15对纸质包装不适用。耳机出口一般不征出口关税——绝大多数中国出口商品（除少数限制出口资源品如稀土、部分矿产品等）为零出口关税。",
    knowledgePoint: "CIF卖方负责出口报关；纸箱不触发ISPM 15检疫要求；绝大多数消费品出口零关税",
  },
  {
    id: "comp-contract",
    step: 7,
    title: "合同条款终审",
    module: "contract",
    moduleLabel: "合同条款",
    scenario:
      "在最终确认订单前，你审核买方发来的Sales Contract。你注意到一个条款：'Any dispute arising from this Contract shall be submitted to the competent court in Hamburg, Germany.'（因本合同引起的任何争议应提交德国汉堡有管辖权的法院）。",
    question: "作为中国出口商，这个条款对你有何风险？",
    options: [
      { id: "a", label: "无所谓——反正我们从来不跟客户打官司" },
      { id: "b", label: "极高风险——在对方所在地法院诉讼，你在语言、法律、成本上全面劣势。应争取改为第三地仲裁（如SIAC/HKIAC）" },
      { id: "c", label: "德国法院比较公正——问题不大" },
      { id: "d", label: "这种条款在国际合同中很常见，不需要修改" },
    ],
    correctIndex: 1,
    explanation:
      "在买方所在地的法院管辖是对卖方极不利的安排——一旦发生争议，你需要：聘请德国律师（德语+德国民事诉讼法）、将中文文件全部翻译成德语（费用高且可能错译）、派人或委托代理在德国出庭（旅途+时间+费用）、面对不熟悉的法律程序和对方主场优势。恰当的反建议是：「Any dispute arising from or in connection with this Contract shall be submitted to [SIAC / HKIAC / CIETAC] for arbitration in [Singapore / Hong Kong / Beijing] in accordance with its arbitration rules. The arbitration shall be conducted in [English / Chinese].」这是一条你可能永远用不到但绝不能没有的条款。",
    knowledgePoint: "争议解决条款：绝不同意在买方所在地法院管辖——坚持第三方中立仲裁",
  },
];

interface Answer {
  stepId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export default function ComprehensivePracticePage() {
  const [phase, setPhase] = useState<"intro" | "steps" | "results">("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const step = STEPS[currentStep];
  const isCorrect = selectedOption === step?.correctIndex;

  const score = answers.filter((a) => a.isCorrect).length;

  const weakModules = useMemo(() => {
    return answers
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const s = STEPS.find((x) => x.id === a.stepId)!;
        return { module: s.module, label: s.moduleLabel };
      })
      .filter((v, i, arr) => arr.findIndex((x) => x.module === v.module) === i);
  }, [answers]);

  const handleSelect = (idx: number) => {
    if (!submitted) setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === step.correctIndex;
    setAnswers((prev) => [...prev, { stepId: step.id, selectedIndex: selectedOption, isCorrect: correct }]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentStep + 1 >= STEPS.length) {
      setPhase("results");
    } else {
      setSelectedOption(null);
      setSubmitted(false);
      setCurrentStep((p) => p + 1);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setPhase("intro");
    setCurrentStep(0);
    setSelectedOption(null);
    setSubmitted(false);
  };

  // ─── Intro ───
  if (phase === "intro") {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
          <h1 className="text-xl font-semibold mb-8">综合实战</h1>
          <div className="text-center py-12 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">模拟完整外贸业务全流程</h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {STEPS.length} 个步骤 · 横跨 7 大知识领域
              </p>
            </div>
            <div className="max-w-sm mx-auto text-left border rounded-lg p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-medium">流程：</p>
              <div className="space-y-0">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex gap-3 pb-2 relative">
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-[13px] top-6 bottom-0 w-px" style={{ background: "var(--color-border)" }} />
                    )}
                    <div
                      className="shrink-0 w-[27px] h-[27px] rounded-full border flex items-center justify-center text-xs font-medium"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm">{s.title}</p>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.moduleLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                你将扮演出口商业务经理，为同一笔订单做出从报价到合同的全流程专业判断。
              </p>
            </div>
            <button
              onClick={() => setPhase("steps")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
              style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
            >
              开始综合实战 →
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ─── Results ───
  if (phase === "results") {
    const pct = Math.round((score / STEPS.length) * 100);
    return (
      <>
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
          <h1 className="text-xl font-semibold mb-8">综合实战 · 结果</h1>

          <div className="space-y-6">
            {/* Score card */}
            <div className="border rounded-lg p-6 text-center" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-4xl font-bold">{score} / {STEPS.length}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                正确率 {pct}%
                {pct >= 80 ? " · 优秀！你对国际贸易全流程有扎实的理解。" :
                 pct >= 50 ? " · 不错！但在一些环节还需要加强。" :
                 " · 需要系统性地补充各模块知识。"}
              </p>
            </div>

            {/* Step-by-step results */}
            <div>
              <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>各步骤结果</h2>
              <div className="mt-3 space-y-2">
                {STEPS.map((s) => {
                  const ans = answers.find((a) => a.stepId === s.id);
                  const correct = ans?.isCorrect;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 px-4 py-3 border rounded-lg"
                      style={{ borderColor: correct ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}
                    >
                      <span className="text-lg shrink-0">{correct ? "✓" : "✗"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">步骤{s.step}：{s.title}</p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.moduleLabel}</p>
                      </div>
                      {!correct && ans && (
                        <span className="text-xs shrink-0" style={{ color: "var(--color-status-learning)" }}>
                          选错了
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weak modules */}
            {weakModules.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>薄弱领域</h2>
                <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  以下知识领域需要加强复习：
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {weakModules.map((wm) => (
                    <Link
                      key={wm.module}
                      href={`/${wm.module}`}
                      className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {wm.label} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="border rounded-lg p-5" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-semibold mb-3">推荐下一步</h2>
              <div className="space-y-2">
                {weakModules.length > 0 && (
                  <Link
                    href="/flashcards"
                    className="block text-sm py-2 px-4 border rounded-md hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    去闪卡复习薄弱知识
                  </Link>
                )}
                <Link
                  href="/practice"
                  className="block text-sm py-2 px-4 border rounded-md hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  回到场景实战选择其他模块
                </Link>
                <button
                  onClick={handleRestart}
                  className="w-full text-left text-sm py-2 px-4 border rounded-md hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  重新开始综合实战
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ─── Steps ───
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <h1 className="text-xl font-semibold mb-8">综合实战</h1>

        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--color-text-muted)" }}>
              步骤 {step.step} / {STEPS.length}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              已答对 {score} 步
            </span>
          </div>

          <div className="h-1 rounded-full w-full" style={{ background: "var(--color-border-light)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%`, background: "var(--color-text)" }}
            />
          </div>

          {/* Module badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-border)", color: "var(--color-text-muted)" }}>
              {step.moduleLabel}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold">{step.title}</h2>

          {/* Scenario */}
          <div className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>场景</span>
            <p className="mt-2 text-sm leading-relaxed">{step.scenario}</p>
          </div>

          {/* Question */}
          <p className="text-sm font-medium leading-relaxed">{step.question}</p>

          {/* Options */}
          <div className="space-y-2">
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let borderColor = "var(--color-border)";
              let bg = "transparent";

              if (submitted) {
                if (idx === step.correctIndex) {
                  borderColor = "var(--color-status-mastered)";
                  bg = "#f0faf0";
                } else if (isSelected && !isCorrect) {
                  borderColor = "var(--color-status-learning)";
                  bg = "#fef5f5";
                }
              } else if (isSelected) {
                borderColor = "var(--color-text)";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className="w-full text-left px-4 py-3 rounded-lg border transition-colors"
                  style={{
                    borderColor,
                    background: bg,
                    cursor: submitted ? "default" : "pointer",
                    opacity: submitted && idx !== step.correctIndex && !isSelected ? 0.6 : 1,
                  }}
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                  {submitted && idx === step.correctIndex && (
                    <span className="ml-2 text-xs" style={{ color: "var(--color-status-mastered)" }}>✓ 正确</span>
                  )}
                  {submitted && isSelected && !isCorrect && (
                    <span className="ml-2 text-xs" style={{ color: "var(--color-status-learning)" }}>✗ 你的选择</span>
                  )}
                </button>
              );
            })}
          </div>

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full py-2.5 text-sm font-medium rounded-md border transition-colors disabled:opacity-30"
              style={{
                color: selectedOption !== null ? "var(--color-text)" : "var(--color-text-muted)",
                borderColor: selectedOption !== null ? "var(--color-text)" : "var(--color-border)",
              }}
            >
              提交答案
            </button>
          )}

          {submitted && (
            <div className="space-y-4">
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}
              >
                <p className="text-sm font-semibold" style={{ color: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>
                  {isCorrect ? "✓ 判断正确！" : "✗ 判断有偏差"}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {step.explanation}
                </p>
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>核心要点</span>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>{step.knowledgePoint}</p>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
              >
                {currentStep + 1 >= STEPS.length ? "查看综合评估 →" : "下一步 →"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
