import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId: id } = await params;
    if (!id) return NextResponse.json("No discussion with this ID found!", { status: 400 });
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    const flatdiscussion = await prisma.discussion.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
            profileUrl: true,
            beltRank: true,
            isBanned: true,
            isShadowBanned: true,
          },
        },
        attachments: true,
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                name: true,
                firstName: true,
                lastName: true,
                profileUrl: true,
                beltRank: true,
              },
            },
            attachments: true,
          },
        },
        likes: {
          where: {
            userId: user.id,
          },
          select: {
            type: true,
          },
        },
        bookmarks: {
          where: { userId: user.id },
          select: {
            id: true,
          },
        },
        tag: true,
      },
    });
    if (!flatdiscussion) return NextResponse.json("No such discussion!", { status: 404 });
    if (flatdiscussion.author.isBanned) {
      return NextResponse.json("This discussion couldn't be found at this moment!", {
        status: 400,
      });
    }
    const discussion = {
      ...flatdiscussion,
      isLiked: flatdiscussion.likes.length > 0 && flatdiscussion.likes[0].type === "like",
      isDisliked: flatdiscussion.likes.length > 0 && flatdiscussion.likes[0].type === "dislike",
      isBookmarked: flatdiscussion.bookmarks.length > 0,
      likes: undefined,
      bookmarks: undefined,
    };

    return NextResponse.json(discussion);
  } catch (error) {
    return NextResponse.json("Failed to fetch this discussion!", { status: 500 });
  }
}
