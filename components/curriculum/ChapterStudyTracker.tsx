"use client";

import { useEffect } from "react";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";

/** Marks a chapter as opened without introducing a separate micro-course step. */
export default function ChapterStudyTracker({ chapterId }: { chapterId: string }) {
  const { markChapterOpened, addStudySeconds, hydrated } = useCurriculumProgress();

  useEffect(() => {
    if (!hydrated) return;
    const startedAt = Date.now();
    markChapterOpened(chapterId);
    return () => addStudySeconds(chapterId, (Date.now() - startedAt) / 1000);
  }, [chapterId, hydrated, markChapterOpened, addStudySeconds]);

  return null;
}
