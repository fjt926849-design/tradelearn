import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TransportFlashcardDeck from "@/components/flashcards/TransportFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

export default function TransportFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/transport" label="返回国际运输" />
        <TransportFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
