import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId: id } = await params;
    if (!id) return NextResponse.json("No comment with this ID found!", { status: 400 });

    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const isLiked = await prisma.like.findUnique({
      where: {
        userId_commentId: { userId: user.id, commentId: id },
      },
    });
    if (isLiked) {
      if (isLiked.type === "dislike") {
        await prisma.$transaction([
          prisma.like.delete({
            where: {
              id: isLiked.id,
            },
          }),
          prisma.comment.update({
            where: { id: id },
            data: { dislikeCount: { decrement: 1 } },
          }),
        ]);

        return NextResponse.json("Like removed", { status: 201 });
      } else {
        await prisma.$transaction([
          prisma.like.update({
            where: { id: isLiked.id },
            data: { type: "dislike" },
          }),
          prisma.comment.update({
            where: { id: id },
            data: { likeCount: { decrement: 1 }, dislikeCount: { increment: 1 } },
          }),
        ]);

        return NextResponse.json("Switched to like", { status: 201 });
      }
    }

    const newLike = await prisma.$transaction(async (tx) => {
      const like = await tx.like.create({
        data: {
          type: "dislike",
          userId: user.id,
          commentId: id,
        },
      });

      await tx.comment.update({
        where: {
          id,
        },
        data: {
          dislikeCount: { increment: 1 },
        },
      });
      return like;
    });

    return NextResponse.json(newLike, { status: 200 });
  } catch (error) {
    return NextResponse.json("Failed to like/unlike", { status: 500 });
  }
}
