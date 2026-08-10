import type { KnowledgeMapNode } from "@/lib/types";

export const knowledgeMapData: KnowledgeMapNode = {
  id: "root",
  title: "国际贸易实务",
  description: "全面掌握国际贸易的核心知识与操作流程",
  icon: "🌍",
  isPlaceholder: false,
  children: [
    {
      id: "trade-terms",
      title: "贸易术语",
      description: "Incoterms 2020 — E/F/C/D 四组 11 个术语详解",
      icon: "📋",
      route: "/terms",
      isPlaceholder: false,
      children: [
        { id: "group-e", title: "E组 · 启运", description: "EXW — 工厂交货", icon: "🏁", isPlaceholder: false },
        { id: "group-f", title: "F组 · 主运费未付", description: "FCA / FAS / FOB", icon: "🚚", isPlaceholder: false },
        { id: "group-c", title: "C组 · 主运费已付", description: "CFR / CIF / CPT / CIP", icon: "💼", isPlaceholder: false },
        { id: "group-d", title: "D组 · 到达", description: "DAP / DPU / DDP", icon: "🎯", isPlaceholder: false },
      ],
    },
    {
      id: "payment-methods",
      title: "支付方式",
      description: "信用证、托收、电汇等国际结算方式",
      icon: "💳",
      isPlaceholder: true,
    },
    {
      id: "transport-logistics",
      title: "运输与物流",
      description: "海运、空运、陆运及多式联运实务",
      icon: "🚢",
      isPlaceholder: true,
    },
    {
      id: "documents",
      title: "单据管理",
      description: "提单、发票、箱单、产地证等贸易单据",
      icon: "📄",
      isPlaceholder: true,
    },
    {
      id: "customs",
      title: "报关与检验",
      description: "进出口报关流程、HS编码与检验检疫",
      icon: "🏛️",
      isPlaceholder: true,
    },
    {
      id: "insurance",
      title: "保险",
      description: "货物运输保险的类型和投保实务",
      icon: "🛡️",
      isPlaceholder: true,
    },
    {
      id: "contract",
      title: "合同条款",
      description: "国际货物买卖合同的核心条款解析",
      icon: "📝",
      isPlaceholder: true,
    },
  ],
};
