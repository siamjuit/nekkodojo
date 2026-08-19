import { invalidateCommentCaches } from "@/lib/actions/caching";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId: id } = await params;
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const isBookmarked = await prisma.bookmark.findUnique({
      where: {
        userId_commentId: { userId: user.id, commentId: id },
      },
    });
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { discussionId: true },
    });
    if (!comment) return NextResponse.json("No such comment.", { status: 404 });

    if (isBookmarked) {
      await prisma.bookmark.delete({
        where: {
          id: isBookmarked.id,
        },
      });

      await invalidateCommentCaches(comment.discussionId);
      return NextResponse.json("Bookmark removed!", { status: 200 });
    }
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        commentId: id,
      },
    });

    await invalidateCommentCaches(comment.discussionId);
    return NextResponse.json("Bookmarked!", { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error occured: ${error}`, { status: 500 });
  }
}
