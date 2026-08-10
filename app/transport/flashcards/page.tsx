import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TransportFlashcardDeck from "@/components/flashcards/TransportFlashcardDeck";

export default function TransportFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <TransportFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
