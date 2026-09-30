import { notFound } from "next/navigation";
import { insuranceConcepts, getInsuranceConceptById } from "@/data/insurance-concepts";
import ConceptDetailView from "@/components/learn/ConceptDetailView";

export async function generateStaticParams() {
  return insuranceConcepts.map((c) => ({ id: c.id }));
}

export default async function InsuranceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getInsuranceConceptById(id);
  if (!concept) notFound();

  return (
    <ConceptDetailView
      moduleId="insurance"
      concept={concept}
      concepts={insuranceConcepts}
    />
  );
}
