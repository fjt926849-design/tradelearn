import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettlementFlashcardDeck from "@/components/flashcards/SettlementFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

export default function SettlementFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/settlement" label="返回国际结算" />
        <SettlementFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
