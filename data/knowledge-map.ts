import type { KnowledgeMapNode } from "@/lib/types";

export const knowledgeMapData: KnowledgeMapNode = {
  id: "root",
  title: "国际贸易实务",
  description: "全面掌握国际贸易的核心知识与操作流程",
  isPlaceholder: false,
  children: [
    {
      id: "trade-terms",
      title: "贸易术语",
      description: "Incoterms 2020 — E/F/C/D 四组 11 个术语详解",
      route: "/terms",
      isPlaceholder: false,
      children: [
        { id: "group-e", title: "E组 · 启运", description: "EXW — 工厂交货", isPlaceholder: false },
        { id: "group-f", title: "F组 · 主运费未付", description: "FCA / FAS / FOB", isPlaceholder: false },
        { id: "group-c", title: "C组 · 主运费已付", description: "CFR / CIF / CPT / CIP", isPlaceholder: false },
        { id: "group-d", title: "D组 · 到达", description: "DAP / DPU / DDP", isPlaceholder: false },
      ],
    },
    {
      id: "settlement",
      title: "国际结算",
      description: "T/T · D/P · D/A · L/C · O/A 支付方式与贸易融资",
      route: "/settlement",
      isPlaceholder: false,
    },
    {
      id: "transport-logistics",
      title: "国际运输",
      description: "海运、空运、铁路、多式联运及集装箱实务",
      route: "/transport",
      isPlaceholder: false,
    },
    {
      id: "insurance",
      title: "货运保险",
      description: "货物运输保险的险别、计算与索赔实务",
      route: "/insurance",
      isPlaceholder: false,
    },
    {
      id: "documents",
      title: "进出口单据",
      description: "发票、提单、箱单、产地证等贸易单据详解",
      route: "/documents",
      isPlaceholder: false,
    },
    {
      id: "customs",
      title: "报关与检验",
      description: "进出口报关流程、HS编码、完税价格与商检",
      route: "/customs",
      isPlaceholder: false,
    },
    {
      id: "contract",
      title: "合同条款",
      description: "国际货物买卖合同的核心条款与风险防范",
      route: "/contract",
      isPlaceholder: false,
    },
  ],
};
