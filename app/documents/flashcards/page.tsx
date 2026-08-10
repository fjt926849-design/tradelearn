import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DocumentsFlashcardDeck from "@/components/flashcards/DocumentsFlashcardDeck";

export default function DocumentsFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <DocumentsFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
