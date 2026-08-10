import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InsuranceFlashcardDeck from "@/components/flashcards/InsuranceFlashcardDeck";

export default function InsuranceFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <InsuranceFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
