import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModuleFlashcardDeck from "@/components/flashcards/ModuleFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

export default function CustomsFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/customs" label="返回报关与检验" />
        <ModuleFlashcardDeck moduleId="customs" />
      </main>
      <Footer />
    </>
  );
}
