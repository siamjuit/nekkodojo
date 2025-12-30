import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TagClient from "@/components/Admin/Tag/TagClient";

export const dynamic = "force-dynamic";

export default async function TagManagementPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const tags: TagData[] = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          discussions: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      <TagClient data={tags} />
    </div>
  );
}
