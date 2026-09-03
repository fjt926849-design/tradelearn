import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import TermFlashcardReview from "@/components/terms/TermFlashcardReview";

export default function UnifiedFlashcards() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-10">
        <BackButton fallbackRoute="/terms-preview" label="返回术语卡片" />
        <div className="mt-8">
          <TermFlashcardReview />
        </div>
      </main>
      <Footer />
    </>
  );
}
