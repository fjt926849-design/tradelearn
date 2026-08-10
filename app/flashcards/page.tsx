import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                加载中...
              </p>
            </div>
          }
        >
          <FlashcardDeck />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
