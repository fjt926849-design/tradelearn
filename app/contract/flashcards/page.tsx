import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContractFlashcardDeck from "@/components/flashcards/ContractFlashcardDeck";
import BackButton from "@/components/learn/BackButton";

export default function ContractFlashcardsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/contract" label="返回合同条款" />
        <ContractFlashcardDeck />
      </main>
      <Footer />
    </>
  );
}
