import { notFound } from "next/navigation";
import { customsConcepts, getCustomsConceptById } from "@/data/customs-concepts";
import ConceptDetailView from "@/components/learn/ConceptDetailView";

export async function generateStaticParams() {
  return customsConcepts.map((c) => ({ id: c.id }));
}

export default async function CustomsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getCustomsConceptById(id);
  if (!concept) notFound();

  return (
    <ConceptDetailView
      moduleId="customs"
      concept={concept}
      concepts={customsConcepts}
    />
  );
}
