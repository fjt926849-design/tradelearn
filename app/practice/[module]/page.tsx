import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GenericPracticeDeck from "@/components/practice/GenericPracticeDeck";
import { moduleScenarioQuestions } from "@/data/module-scenario-questions";
import { MODULE_LABELS, MODULE_CHAPTERS } from "@/lib/types";
import type { ModuleId } from "@/lib/types";

const MODULE_INTRO_ITEMS: Record<string, string[]> = {
  settlement: ["选择合适的结算方式", "识别L/C软条款和风险", "判断贸易融资工具的适用场景", "评估不同结算方式下的风险与成本"],
  transport: ["选择最优运输方式", "计算和比较不同运输选项的成本", "判断提单签署方式的法律含义", "识别运费构成中的隐性成本"],
  insurance: ["选择合适的保险险别", "计算保险金额和保险费", "判断保险覆盖与风险转移的关系", "正确处理保险索赔流程"],
  documents: ["判断单据之间是否存在矛盾（不符点）", "选择合适的原产地证格式", "理解提单和空运单的关键区别", "掌握电放和正本提单的正确操作"],
  customs: ["判断不同Incoterms下的报关责任归属", "识别HS编码错误可能带来的后果", "理解DDP的进口报关和税费风险", "规避木质包装的检验检疫问题"],
  contract: ["判断邮件中的确认是否构成合同成立", "识别违约是属于根本违约还是普通违约", "评估争议解决条款的隐藏成本和风险", "区分不可抗力与商业风险"],
};

export default async function ModulePracticePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;

  // Validate module
  const validModules: ModuleId[] = ["settlement", "transport", "insurance", "documents", "customs", "contract"];
  if (!validModules.includes(module as ModuleId)) notFound();

  const questions = moduleScenarioQuestions.filter((q) => q.module === module);
  if (questions.length === 0) notFound();

  const label = MODULE_LABELS[module as ModuleId] || module;
  const chapter = MODULE_CHAPTERS[module as ModuleId];
  const introItems = MODULE_INTRO_ITEMS[module] || ["根据业务场景做出正确的专业判断"];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <GenericPracticeDeck
          questions={questions}
          title={`${chapter.no} ${label}实战`}
          subtitle={`${label}场景判断练习`}
          introItems={introItems}
          homeRoute="/practice"
          moduleId={module as ModuleId}
        />
      </main>
      <Footer />
    </>
  );
}
