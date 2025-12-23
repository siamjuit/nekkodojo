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

    const isBookmarked = await prisma.bookmark.findUnique({
      where: {
        userId_discussionId: { userId: user.id, discussionId: id },
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
        discussionId: id,
      },
    });

    return NextResponse.json("Bookmarked!", { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error occured: ${error}`, { status: 500 });
  }
}
