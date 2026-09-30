import { notFound } from "next/navigation";
import { transportConcepts, getTransportConceptById } from "@/data/transport-concepts";
import ConceptDetailView from "@/components/learn/ConceptDetailView";

export async function generateStaticParams() {
  return transportConcepts.map((c) => ({ id: c.id }));
}

export default async function TransportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getTransportConceptById(id);
  if (!concept) notFound();

  return (
    <ConceptDetailView
      moduleId="transport"
      concept={concept}
      concepts={transportConcepts}
    />
  );
}
