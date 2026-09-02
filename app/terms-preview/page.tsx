"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import { tradeTerms } from "@/data/trade-terms";

const groups = [
  { key: "all", label: "全部" },
  { key: "E", label: "E 组" },
  { key: "F", label: "F 组" },
  { key: "C", label: "C 组" },
  { key: "D", label: "D 组" },
] as const;

export default function TermsPreviewPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]["key"]>("all");

  const visibleTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tradeTerms.filter((term) => {
      const matchesGroup = group === "all" || term.category === group;
      const matchesQuery =
        !normalized ||
        [term.code, term.chineseName, term.fullName, term.summary]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/terms" label="返回术语中心" />

          <section className="mt-8 overflow-hidden rounded-[28px] border" style={{ borderColor: "#dedede", background: "rgba(250,250,250,.8)", boxShadow: "0 18px 50px rgba(0,0,0,.06)" }}>
            <div className="border-b px-6 py-8 sm:px-10 sm:py-10" style={{ borderColor: "#dedede", background: "rgba(245,245,245,.72)", backdropFilter: "blur(14px)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#777" }}>TRADELEARN · TERM CARDS</p>
              <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">贸易术语卡片馆</h1>
                  <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: "#666" }}>把每一个术语整理成一张清晰的资料卡。先看名称和含义，再进入详情理解它在业务中的位置。</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "#dedede" }}><p className="text-2xl font-semibold">{tradeTerms.length}</p><p className="mt-1 text-xs" style={{ color: "#777" }}>当前术语</p></div>
                  <div className="rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "#dedede" }}><p className="text-2xl font-semibold">4</p><p className="mt-1 text-xs" style={{ color: "#777" }}>责任分组</p></div>
                  <div className="hidden rounded-2xl border bg-white/70 px-4 py-3 sm:block" style={{ borderColor: "#dedede" }}><p className="text-2xl font-semibold">2020</p><p className="mt-1 text-xs" style={{ color: "#777" }}>规则版本</p></div>
                </div>
              </div>
            </div>

            <div className="border-b px-6 py-5 sm:px-10" style={{ borderColor: "#dedede", background: "rgba(255,255,255,.7)", backdropFilter: "blur(12px)" }}>
              <label className="relative block">
                <span className="sr-only">搜索术语</span>
                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "#888" }}>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索缩写、中文名称或用途" className="h-12 w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-sm outline-none transition focus:border-[#777]" style={{ borderColor: "#d8d8d8" }} />
              </label>
              <div className="mt-4 flex flex-wrap gap-2" aria-label="术语分组">
                {groups.map((item) => {
                  const active = group === item.key;
                  return <button key={item.key} type="button" onClick={() => setGroup(item.key)} className="rounded-full border px-4 py-2 text-xs transition" style={{ borderColor: active ? "#222" : "#dedede", background: active ? "#222" : "rgba(255,255,255,.72)", color: active ? "#fff" : "#666" }}>{item.label}</button>;
                })}
              </div>
            </div>

            <div className="px-6 py-7 sm:px-10 sm:py-9">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium">{group === "all" ? "全部术语" : `${group} 组术语`}</p>
                <p className="text-xs" style={{ color: "#888" }}>{visibleTerms.length} 张卡片</p>
              </div>
              {visibleTerms.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleTerms.map((term) => (
                    <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-[22px] border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,.1)]" style={{ borderColor: "#dcdcdc", background: "rgba(255,255,255,.72)", boxShadow: "0 7px 24px rgba(0,0,0,.045)", backdropFilter: "blur(12px)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full border px-3 py-1 text-[11px] font-medium" style={{ borderColor: "#d6d6d6", color: "#666", background: "#f7f7f7" }}>{term.category} 组 · {term.categoryLabel}</span>
                        <span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: "#888" }} aria-hidden="true">↗</span>
                      </div>
                      <div className="mt-8">
                        <p className="text-4xl font-semibold tracking-[-0.05em]">{term.code}</p>
                        <h2 className="mt-2 text-lg font-medium">{term.chineseName}</h2>
                        <p className="mt-1 text-xs tracking-wide" style={{ color: "#888" }}>{term.fullName}</p>
                      </div>
                      <div className="mt-auto border-t pt-4" style={{ borderColor: "#e7e7e7" }}>
                        <p className="line-clamp-2 text-sm leading-6" style={{ color: "#555" }}>{term.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">{term.transportMode.map((mode) => <span key={mode} className="rounded-md bg-[#f4f4f4] px-2 py-1 text-[10px]" style={{ color: "#777" }}>{mode}</span>)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : <div className="rounded-2xl border px-5 py-16 text-center" style={{ borderColor: "#dedede" }}><p className="text-sm font-medium">没有找到匹配术语</p><p className="mt-2 text-xs" style={{ color: "#888" }}>试试搜索其他缩写或清空筛选条件。</p></div>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
