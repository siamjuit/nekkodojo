import { prisma } from "@/lib/prisma";
import { CompanyQuestionsSheet } from "@/components/Company/CompanySheet";
import { redirect } from "next/navigation";
import { fetchItems } from "@/lib/actions/caching";
import { currentUser } from "@clerk/nextjs/server";

export default async function CompanyProblemsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  if (!companySlug) return redirect("/problems");

  const user = await currentUser();
  const userProgressPromise = user
    ? prisma.userProgress.findMany({
        where: { userId: user.id },
        select: { questionId: true, status: true },
      })
    : Promise.resolve([]);

  const companyDataPromise = fetchItems({
    key: `company:${companySlug}`,
    expires: 3600,
    fetcher: async () => {
      return prisma.company.findUnique({
        where: { slug: companySlug },
        include: {
          questions: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              externalPlatformUrl: true,
              solutionUrl: true,
            },
          },
        },
      });
    },
  });

  const [userProgressData, companyData] = await Promise.all([
    userProgressPromise,
    companyDataPromise,
  ]);

  if (!companyData) return <div>Company not found</div>;

  const progressMap: Record<string, string> = {};
  userProgressData.forEach((p) => {
    progressMap[p.questionId] = p.status.toLowerCase();
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <CompanyQuestionsSheet
          questions={companyData.questions}
          companyName={companyData.name}
          userProgress={progressMap}
        />
      </div>
    </div>
  );
}
