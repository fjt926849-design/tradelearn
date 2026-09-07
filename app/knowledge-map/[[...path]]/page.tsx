import { redirect } from "next/navigation";

/** The retired curriculum surface remains a safe landing point for old bookmarks. */
export default function RetiredKnowledgeMapPage() {
  redirect("/terms-preview");
}
