"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";
import SettlementFlashcardDeck from "@/components/flashcards/SettlementFlashcardDeck";
import TransportFlashcardDeck from "@/components/flashcards/TransportFlashcardDeck";
import InsuranceFlashcardDeck from "@/components/flashcards/InsuranceFlashcardDeck";
import DocumentsFlashcardDeck from "@/components/flashcards/DocumentsFlashcardDeck";
import CustomsFlashcardDeck from "@/components/flashcards/CustomsFlashcardDeck";
import ContractFlashcardDeck from "@/components/flashcards/ContractFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

type ModuleKey = "incoterms" | "settlement" | "transport" | "insurance" | "documents" | "customs" | "contract";

const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "incoterms", label: "贸易术语" },
  { key: "settlement", label: "国际结算" },
  { key: "transport", label: "国际运输" },
  { key: "insurance", label: "货运保险" },
  { key: "documents", label: "进出口单据" },
  { key: "customs", label: "报关与检验" },
  { key: "contract", label: "合同条款" },
];

function ModulePicker({
  active,
  onChange,
}: {
  active: ModuleKey;
  onChange: (m: ModuleKey) => void;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold mb-3">闪卡复习</h1>
      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
        每个知识领域独立追踪学习进度，选择模块开始复习
      </p>
      <div className="flex flex-wrap gap-1.5">
        {MODULES.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className="px-3 py-1.5 text-xs rounded-md border transition-colors"
            style={{
              borderColor: active === m.key ? "var(--color-text)" : "var(--color-border)",
              background: active === m.key ? "var(--color-text)" : "transparent",
              color: active === m.key ? "#fff" : "var(--color-text-secondary)",
              fontWeight: active === m.key ? 500 : 400,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function UnifiedFlashcards() {
  const searchParams = useSearchParams();
  const initialModule = (searchParams.get("module") as ModuleKey) || "incoterms";
  const [activeModule, setActiveModule] = useState<ModuleKey>(initialModule);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/" label="返回首页" />
        <ModulePicker active={activeModule} onChange={setActiveModule} />

        {activeModule === "incoterms" && <FlashcardDeck />}
        {activeModule === "settlement" && <SettlementFlashcardDeck />}
        {activeModule === "transport" && <TransportFlashcardDeck />}
        {activeModule === "insurance" && <InsuranceFlashcardDeck />}
        {activeModule === "documents" && <DocumentsFlashcardDeck />}
        {activeModule === "customs" && <CustomsFlashcardDeck />}
        {activeModule === "contract" && <ContractFlashcardDeck />}
      </main>
      <Footer />
    </>
  );
}
