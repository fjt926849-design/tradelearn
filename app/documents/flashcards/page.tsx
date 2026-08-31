import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DocumentsFlashcardDeck from "@/components/flashcards/DocumentsFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

export default function DocumentsFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/documents" label="返回进出口单据" />
        <DocumentsFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
