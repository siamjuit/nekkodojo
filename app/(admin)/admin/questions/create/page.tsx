import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateQuestionForm from "@/components/Admin/Questions/CreateQuestionForm";

export const dynamic = "force-dynamic";

export default async function CreateQuestionPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // 1. Fetch Categories for Dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  // 2. Fetch Companies for Dropdown
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  // 3. Format for the MultiSelect component
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.slug,
  }));

  const companyOptions = companies.map((c) => ({
    label: c.name,
    value: c.slug,
  }));

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#eaddcf]">Add New Kata</h1>
        <p className="text-[#a1887f] mt-1">
          Create a new problem to add to the Dojo library.
        </p>
      </div>

      <CreateQuestionForm 
        categoryOptions={categoryOptions} 
        companyOptions={companyOptions} 
      />
    </div>
  );
}