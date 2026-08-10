import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomsFlashcardDeck from "@/components/flashcards/CustomsFlashcardDeck";

export default function CustomsFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <CustomsFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
