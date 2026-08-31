import type { ModuleId } from "@/lib/types";

export interface CurriculumLegacyMapping {
  moduleId: ModuleId;
  conceptIds: string[];
}

/**
 * 旧模块知识点到教材章节的固定映射。
 * 只用于在课程中心展示已有学习积累，不会反向修改旧模块记录。
 */
export const curriculumLegacyMapping: Record<string, CurriculumLegacyMapping[]> = {
  "ch-02": [{ moduleId: "incoterms", conceptIds: ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP"] }],
  "ch-03": [{ moduleId: "incoterms", conceptIds: ["FAS", "FOB", "CFR", "CIF"] }],
  "ch-04": [{ moduleId: "contract", conceptIds: ["contract-overview", "quality-clause", "quantity-clause", "packing-clause", "title-transfer"] }],
  "ch-05": [{ moduleId: "transport", conceptIds: ["sea-freight", "air-freight", "rail-freight", "multimodal", "fcl-lcl", "container", "bill-of-lading-transport", "carrier", "freight-forwarder", "freight-cost"] }],
  "ch-06": [{ moduleId: "insurance", conceptIds: ["cargo-insurance-basics", "insurance-coverage", "insured-amount", "insurance-premium", "insurance-policy-cert", "risk-vs-insurance", "insurance-claim", "insurance-types"] }],
  "ch-07": [{ moduleId: "contract", conceptIds: ["price-clause"] }],
  "ch-08": [{ moduleId: "settlement", conceptIds: ["settlement-basics", "tt", "lc", "dp", "da", "oa", "ucp600", "lc-risks", "forfaiting", "factoring", "packing-loan", "bank-guarantee"] }],
  "ch-09": [
    { moduleId: "customs", conceptIds: ["inspection-basics"] },
    { moduleId: "documents", conceptIds: ["inspection-cert-doc"] },
  ],
  "ch-10": [{ moduleId: "contract", conceptIds: ["force-majeure", "breach-remedies", "dispute-resolution"] }],
  "ch-12": [{ moduleId: "contract", conceptIds: ["contract-formation"] }],
  "ch-13": [{ moduleId: "documents", conceptIds: ["documents-overview", "commercial-invoice-doc", "packing-list-doc", "bill-of-lading-doc", "air-waybill-doc", "certificate-of-origin-doc", "insurance-policy-doc", "draft-doc", "inspection-cert-doc"] }],
  "ch-14": [{ moduleId: "contract", conceptIds: ["breach-remedies", "force-majeure", "dispute-resolution"] }],
};
