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
      if (isLiked.type === "dislike") {
        await prisma.$transaction([
          prisma.likes.delete({
            where: {
              id: isLiked.id,
            },
          }),
          prisma.discussions.update({
            where: { id: id },
            data: { disLikeCount: { decrement: 1 } },
          }),
        ]);

        return NextResponse.json("Dislike removed", { status: 201 });
      } else {
        await prisma.$transaction([
          prisma.likes.update({
            where: { id: isLiked.id },
            data: { type: "dislike" },
          }),
          prisma.discussions.update({
            where: { id: id },
            data: { disLikeCount: { increment: 1 }, likeCount: { decrement: 1 } },
          }),
        ]);

        return NextResponse.json("Switched to dislike", { status: 201 });
      }
    }

    const newDislike = await prisma.$transaction(async (tx) => {
      const dislike = await tx.likes.create({
        data: {
          type: "dislike",
          userId: user.id,
          discussionId: id,
        },
      });

      await tx.discussions.update({
        where: {
          id,
        },
        data: {
          disLikeCount: { increment: 1 },
        },
      });
      return dislike;
    });

    return NextResponse.json(newDislike, { status: 200 });
  } catch (error) {
    return NextResponse.json("Failed to like/unlike", { status: 500 });
  }
}
