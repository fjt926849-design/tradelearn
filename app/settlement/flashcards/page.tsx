import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettlementFlashcardDeck from "@/components/flashcards/SettlementFlashcardDeck";

export default function SettlementFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <SettlementFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
