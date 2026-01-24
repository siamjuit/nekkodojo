import { fetchItems } from "@/lib/actions/caching";
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

    const cacheKey = `discussion:${id}:u:${user.id}`;
    const discussion = await fetchItems({
      key: cacheKey,
      expires: 60 * 5,
      fetcher: async () => {
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
        if (!flatdiscussion) return null;
        if (flatdiscussion.author.isBanned) {
          return null;
        }
        return {
          ...flatdiscussion,
          isLiked: flatdiscussion.likes.length > 0 && flatdiscussion.likes[0].type === "like",
          isDisliked: flatdiscussion.likes.length > 0 && flatdiscussion.likes[0].type === "dislike",
          isBookmarked: flatdiscussion.bookmarks.length > 0,
          likes: undefined,
          bookmarks: undefined,
        };
      },
    });
    if (!discussion) {
      return NextResponse.json("Discussion not found", { status: 404 });
    }
    return NextResponse.json(discussion);
  } catch (error) {
    return NextResponse.json("Failed to fetch this discussion!", { status: 500 });
  }
}
