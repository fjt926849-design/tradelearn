import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PracticeDeck from "@/components/practice/PracticeDeck";

export default function IncotermsPracticePage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <Suspense
          fallback={
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>加载中...</p>
            </div>
          }
        >
          <PracticeDeck />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
