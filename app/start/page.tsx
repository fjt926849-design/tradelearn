"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const questions = [
  { title: "你目前最想解决什么问题？", options: ["看懂贸易术语", "完成一笔出口业务", "提高单据与结算能力"] },
  { title: "你接触过外贸业务吗？", options: ["完全没有", "看过一些资料", "正在做或已经做过"] },
];

export default function StartPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = step >= questions.length;

  const choose = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep((value) => value + 1);
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-12">
        {!done ? (
          <section className="space-y-6">
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>学习诊断 · {step + 1}/{questions.length}</p>
              <h1 className="text-xl font-semibold mt-2">{questions[step].title}</h1>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>选择最接近你的选项，我们会为你安排第一课。</p>
            </div>
            <div className="space-y-2">
              {questions[step].options.map((option) => (
                <button key={option} onClick={() => choose(option)} className="w-full text-left border rounded-lg px-4 py-4 text-sm hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--color-border)" }}>
                  {option}<span className="float-right" style={{ color: "var(--color-text-muted)" }}>→</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="border rounded-lg p-6 space-y-5" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>你的起点</p>
              <h1 className="text-xl font-semibold mt-2">先从贸易术语开始</h1>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>先理解成本、风险和交付责任，再进入报价与合同实训。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {answers.map((answer) => <span key={answer} className="text-xs border rounded-full px-2.5 py-1" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>{answer}</span>)}
            </div>
            <div className="flex gap-2">
              <Link href="/terms" className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-md border" style={{ borderColor: "var(--color-text)" }}>进入第一课 →</Link>
              <Link href="/knowledge-map" className="inline-flex items-center px-4 py-2.5 text-sm rounded-md border" style={{ borderColor: "var(--color-border)" }}>查看课程地图</Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
