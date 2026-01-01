import { prisma } from "@/lib/prisma";
import { CompanySection } from "@/components/Company/CompanySection";
import QuestionExplorer from "@/components/Problems/ProblemSheet"; // Check path
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  const user = await currentUser();

  const userProgressData = user
    ? await prisma.userProgress.findMany({
        where: { userId: user.id },
        select: { questionId: true, status: true },
      })
    : [];

  const progressMap: Record<string, string> = {};
  userProgressData.forEach((p) => {
    progressMap[p.questionId] = p.status.toLowerCase();
  });

  const companiesPromise = prisma.company.findMany({
    take: 20,
    orderBy: { questions: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      websiteUrl: true,
      _count: { select: { questions: true } },
      // CRITICAL: Need IDs to calculate percentage in the Carousel
      questions: {
        select: { id: true },
      },
    },
  });

  const categoriesPromise = prisma.category.findMany({
    orderBy: { categoryOrder: "asc" },
    include: {
      questions: {
        orderBy: { title: "asc" },
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

  const [companies, categories] = await Promise.all([companiesPromise, categoriesPromise]);

  return (
    <div className="min-h-screen text-[#eaddcf] py-10">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#d4af37] uppercase">
            The Dojo Library
          </h1>
          <p className="text-[#a1887f] max-w-2xl text-lg">
            Master the ancient arts of algorithms. Train under the banner of a Great House or choose
            your path from the archives.
          </p>
        </div>

        {/* Company Section (With Progress) */}
        <section className="space-y-6">
          <CompanySection
            initialData={companies}
            userProgress={progressMap} // <--- Pass the map here
          />
        </section>

        <div className="h-px w-full bg-linear-to-r from-transparent via-[#3e2723] to-transparent opacity-50" />

        {/* Questions Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-[#eaddcf]">All Katas</h2>
            <span className="text-sm text-[#5d4037] font-mono mt-1">
              ({categories.reduce((acc, cat) => acc + cat.questions.length, 0)} Total)
            </span>
          </div>

          <div className="mx-auto">
            <QuestionExplorer data={categories} />
          </div>
        </section>
      </div>
    </div>
  );
}
