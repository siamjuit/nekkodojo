import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuestionsDashboard from "@/components/Admin/RouteSide/QuestionDashboard";
import QuestionCreationManager from "@/components/Admin/Questions/QuestionCreationManager";

export default async function QuestionsAdminPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // 1. Fetch Data
  const categoriesData = await prisma.category.findMany({
    orderBy: { categoryOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const companiesData = await prisma.company.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  // 2. Map to Options format for your Form
  const categoryOptions = categoriesData.map((c) => ({ label: c.name, value: c.slug }));
  const companyOptions = companiesData.map((c) => ({ label: c.name, value: c.slug }));

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#eaddcf]">Questions Dashboard</h1>
          <p className="text-[#a1887f] mt-2">
            Manage your problem set, organize categories, and track company tags.
          </p>
        </div>

        {/* ✅ Use the Manager Component here */}
        <QuestionCreationManager
          categoryOptions={categoryOptions}
          companyOptions={companyOptions}
        />
      </div>

      <QuestionsDashboard initialCategories={categoriesData} allCompanies={companiesData} />
    </div>
  );
}
