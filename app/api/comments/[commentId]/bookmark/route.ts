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

    if (isBookmarked) {
      await prisma.bookmark.delete({
        where: {
          id: isBookmarked.id,
        },
      });

      return NextResponse.json("Bookmark removed!", { status: 200 });
    }
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        commentId: id,
      },
    });

    return NextResponse.json("Bookmarked!", { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error occured: ${error}`, { status: 500 });
  }
}
