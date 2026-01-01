import { prisma } from "@/lib/prisma";
import { CompanyQuestionsSheet } from "@/components/Company/CompanySheet";
import { redirect } from "next/navigation";

export default async function CompanyProblemsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const companySlug = (await params).companySlug;

  if (!companySlug) return redirect("/problems");

  // Fetch Company + Questions
  const companyData = await prisma.company.findUnique({
    where: { slug: companySlug },
    include: {
      questions: {
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          externalPlatformUrl: true, // DB field name
          solutionUrl: true,
        },
      },
    },
  });

  if (!companyData) return <div>Company not found</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <CompanyQuestionsSheet questions={companyData.questions} companyName={companyData.name} />
      </div>
    </div>
  );
}
