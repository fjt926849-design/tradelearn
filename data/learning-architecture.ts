import { MODULE_LABELS, MODULE_ROUTES, type ModuleId } from "@/lib/types";

export interface DeepLearningModule {
  id: ModuleId;
  label: string;
  description: string;
  route: string;
  conceptCount: number;
}

const moduleDefinitions: Array<{
  id: ModuleId;
  conceptCount: number;
  description: string;
}> = [
  { id: "incoterms", conceptCount: 11, description: "理解 11 个 Incoterms® 2020 规则中的交货、费用和风险边界。" },
  { id: "settlement", conceptCount: 12, description: "学习汇付、托收、信用证和贸易融资中的付款责任。" },
  { id: "transport", conceptCount: 10, description: "掌握运输方式、提单、集装箱、承运人与运费安排。" },
  { id: "insurance", conceptCount: 8, description: "区分承保险别、保险金额、风险缺口和货损索赔。" },
  { id: "documents", conceptCount: 9, description: "认识发票、装箱单、提单、产地证等核心贸易单据。" },
  { id: "customs", conceptCount: 8, description: "梳理进出口报关、HS 编码、完税价格与检验要求。" },
  { id: "contract", conceptCount: 15, description: "学习品质、数量、价格、装运、违约和争议解决条款。" },
];

export const deepLearningModules: DeepLearningModule[] = moduleDefinitions.map((module) => ({
  ...module,
  label: MODULE_LABELS[module.id],
  route: MODULE_ROUTES[module.id],
}));

export const deepKnowledgePointCount = deepLearningModules.reduce(
  (total, module) => total + module.conceptCount,
  0,
);
