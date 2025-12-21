import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId: id } = await params;
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const isLiked = await prisma.likes.findUnique({
      where: {
        userId_discussionId: { userId: user.id, discussionId: id },
      },
    });
    if (isLiked) {
      if (isLiked.type === "like") {
        await prisma.$transaction([
          prisma.likes.delete({
            where: {
              id: isLiked.id,
            },
          }),
          prisma.discussions.update({
            where: { id: id },
            data: { likeCount: { decrement: 1 } },
          }),
        ]);

        return NextResponse.json("Like removed", { status: 201 });
      } else {
        await prisma.$transaction([
          prisma.likes.update({
            where: { id: isLiked.id },
            data: { type: "like" },
          }),
          prisma.discussions.update({
            where: { id: id },
            data: { disLikeCount: { decrement: 1 }, likeCount: { increment: 1 } },
          }),
        ]);

        return NextResponse.json("Switched to like", { status: 201 });
      }
    }

    const newLike = await prisma.$transaction(async (tx) => {
      const like = await tx.likes.create({
        data: {
          type: "like",
          userId: user.id,
          discussionId: id,
        },
      });

      await tx.discussions.update({
        where: {
          id,
        },
        data: {
          likeCount: { increment: 1 },
        },
      });
      return like;
    });

    return NextResponse.json(newLike, { status: 200 });
  } catch (error) {
    return NextResponse.json("Failed to like/unlike", { status: 500 });
  }
}
