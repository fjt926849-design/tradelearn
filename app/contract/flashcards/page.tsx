import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContractFlashcardDeck from "@/components/flashcards/ContractFlashcardDeck";

export default function ContractFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <ContractFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
