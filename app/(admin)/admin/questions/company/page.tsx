import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CompanyClient from "@/components/Admin/Company/CompanyClient"; 

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // Fetch Companies
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      <CompanyClient data={companies} />
    </div>
  );
}