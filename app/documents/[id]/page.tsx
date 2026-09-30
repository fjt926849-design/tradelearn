import { notFound } from "next/navigation";
import { documentsConcepts, getDocumentsConceptById } from "@/data/documents-concepts";
import ConceptDetailView from "@/components/learn/ConceptDetailView";

export async function generateStaticParams() {
  return documentsConcepts.map((c) => ({ id: c.id }));
}

export default async function DocumentsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getDocumentsConceptById(id);
  if (!concept) notFound();

  return (
    <ConceptDetailView
      moduleId="documents"
      concept={concept}
      concepts={documentsConcepts}
    />
  );
}
