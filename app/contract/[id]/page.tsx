import { notFound } from "next/navigation";
import { contractConcepts, getContractConceptById } from "@/data/contract-concepts";
import ConceptDetailView from "@/components/learn/ConceptDetailView";

export async function generateStaticParams() {
  return contractConcepts.map((c) => ({ id: c.id }));
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getContractConceptById(id);
  if (!concept) notFound();

  return (
    <ConceptDetailView
      moduleId="contract"
      concept={concept}
      concepts={contractConcepts}
      legalNotice={
        <div className="rounded-md px-4 py-3 text-xs" style={{ background: "var(--color-accent-soft)", color: "var(--color-text-secondary)" }}>
          <span className="font-medium">学习提示：</span>本页为外贸实务教学材料；合同效力和形式要求取决于适用法律、合同约定及具体证据，正式交易请咨询专业人士。
          <span className="ml-2">参考：<a className="underline" href="https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg" target="_blank" rel="noreferrer">UNCITRAL CISG</a></span>
        </div>
      }
    />
  );
}
