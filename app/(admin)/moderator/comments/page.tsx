import { MessageSquareText, MessageSquareX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";

import { AdminCommentItem } from "../../../../components/Admin/AdminCommentItem"; 
import PaginationControls from "../../../../components/Admin/RouteSide/PaginationControls"; 

export default async function AdminCommentsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await currentUser();
  if (!user || (!checkRole("admin") && !checkRole("moderator"))) {
    redirect("/");
  }

  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const limit = 20; // Show more comments per page than users
  const skip = (page - 1) * limit;

  // Fetch Comments
  const [comments, totalCount] = await prisma.$transaction([
    prisma.comment.findMany({
      take: limit,
      skip: skip,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { firstName: true, lastName: true, profileUrl: true }
        },
        discussion: {
          select: { id: true, title: true }
        }
      }
    }),
    prisma.comment.count()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-[#3e2723] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3e2723]/30 text-[#d4af37]">
          <MessageSquareText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#d4af37] tracking-tight">Inscriptions Log</h1>
          <p className="text-[#a1887f]">
            Monitor the {totalCount} most recent comments across the dojo.
          </p>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {comments.map((comment) => (
               <AdminCommentItem key={comment.id} data={comment} />
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/20">
            <MessageSquareX className="h-16 w-16 text-[#5d4037] mb-4" />
            <h3 className="text-xl font-bold text-[#a1887f]">Silence in the Dojo</h3>
            <p className="text-[#5d4037] text-sm mt-2">No comments found.</p>
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