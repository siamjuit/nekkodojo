import { ScrollText, FileX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles"; // Ensure you have this utility
import { AdminContentItem } from "../../_components/AdminContentItem"; 
import PaginationControls from "../../_components/PaginationControls"; 
import { SearchUsers } from "../../_components/SearchUsers"; 

export default async function AdminContentPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const user = await currentUser();
  
  // Security Check
  if (!user || !checkRole("admin")) {
    redirect("/");
  }

  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch Discussions with Filter & Pagination
  const [discussions, totalCount] = await prisma.$transaction([
    prisma.discussions.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      } : {},
      take: limit,
      skip: skip,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileUrl: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    }),
    prisma.discussions.count({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      } : {},
    })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end border-b border-[#3e2723] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3e2723]/30 text-[#d4af37]">
            <ScrollText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#d4af37] tracking-tight">Scrolls Library</h1>
            <p className="text-[#a1887f]">
              Moderate and manage {totalCount} discussions.
            </p>
          </div>
        </div>

        {/* Search Bar (Reused) */}
        <div className="w-full md:w-auto">
          <SearchUsers /> 
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-4">
        {discussions.length > 0 ? (
          discussions.map((item) => (
            <AdminContentItem key={item.id} data={item} />
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/20">
            <FileX className="h-16 w-16 text-[#5d4037] mb-4" />
            <h3 className="text-xl font-bold text-[#a1887f]">No Scrolls Found</h3>
            <p className="text-[#5d4037] text-sm mt-2">
              {search ? `No results for "${search}"` : "The library is empty."}
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="border-t border-[#3e2723] pt-4 flex justify-center">
          <PaginationControls currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}