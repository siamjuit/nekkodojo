import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CategoryClient from "@/components/Admin/Category/CategoryClient";

export const dynamic = "force-dynamic";

const CategoryManagementPage = async () => {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      categoryOrder: "asc", // Crucial for roadmap view
    },
    include: {
      prerequisiteArray: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      <CategoryClient data={categories} />
    </div>
  );
};

export default CategoryManagementPage;
