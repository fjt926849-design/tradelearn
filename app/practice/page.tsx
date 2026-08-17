import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MODULE_CHAPTERS } from "@/lib/types";
import { getModuleQuestionCount } from "@/data/module-scenario-questions";
import { scenarioQuestions } from "@/data/scenario-questions";
import type { ModuleId } from "@/lib/types";

const modules: { id: ModuleId | "incoterms-legacy"; no: string; label: string; desc: string; count: number; route: string }[] = [
  {
    id: "incoterms-legacy",
    no: MODULE_CHAPTERS.incoterms.no,
    label: "贸易术语",
    desc: "Incoterms 2020 场景判断——根据外贸业务场景选择正确的贸易术语",
    count: scenarioQuestions.length,
    route: "/practice",
  },
  {
    id: "settlement",
    no: MODULE_CHAPTERS.settlement.no,
    label: "国际结算",
    desc: "支付方式选择、L/C审证、贸易融资工具应用",
    count: getModuleQuestionCount("settlement"),
    route: "/practice/settlement",
  },
  {
    id: "transport",
    no: MODULE_CHAPTERS.transport.no,
    label: "国际运输",
    desc: "运输方式选择、运费计算、提单与运输责任",
    count: getModuleQuestionCount("transport"),
    route: "/practice/transport",
  },
  {
    id: "insurance",
    no: MODULE_CHAPTERS.insurance.no,
    label: "货运保险",
    desc: "险别选择、保险金额计算、索赔与风险缺口识别",
    count: getModuleQuestionCount("insurance"),
    route: "/practice/insurance",
  },
  {
    id: "documents",
    no: MODULE_CHAPTERS.documents.no,
    label: "进出口单据",
    desc: "单据一致性判断、原产地证、提单操作",
    count: getModuleQuestionCount("documents"),
    route: "/practice/documents",
  },
  {
    id: "customs",
    no: MODULE_CHAPTERS.customs.no,
    label: "报关与检验",
    desc: "HS编码归类、报关责任、检验检疫合规",
    count: getModuleQuestionCount("customs"),
    route: "/practice/customs",
  },
  {
    id: "contract",
    no: MODULE_CHAPTERS.contract.no,
    label: "合同条款",
    desc: "合同成立与修改、违约识别、争议解决选择",
    count: getModuleQuestionCount("contract"),
    route: "/practice/contract",
  },
];

export default function PracticeHubPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">场景实战</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            选择知识领域，进入业务场景模拟练习
          </p>
        </div>

        {/* Comprehensive banner */}
        <Link
          href="/practice/comprehensive"
          className="block border rounded-lg p-5 mb-8 hover:bg-gray-50 transition-colors"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div>
              <span className="text-sm font-semibold">综合实战</span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--color-border)", color: "var(--color-text-muted)" }}>新</span>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                模拟完整外贸业务全流程——从询价到合同提交
              </p>
            </div>
            <span className="ml-auto text-xs" style={{ color: "var(--color-text-muted)" }}>→</span>
          </div>
        </Link>

        {/* Module list */}
        <div className="space-y-2">
          {modules.map((m) => (
            <Link
              key={m.id}
              href={m.route}
              className="flex items-center gap-4 px-4 py-4 border rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span className="shrink-0 w-9 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{m.no}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {m.desc}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-medium">{m.count} 题</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
