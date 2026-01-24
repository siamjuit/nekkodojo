import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const allBookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        discussion: {
          where: {
            author: {
              isBanned: false,
            },
          },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                name: true,
                profileUrl: true,
                beltRank: true,
              },
            },
            tag: {
              select: {
                slug: true,
              },
            },
            _count: {
              select: { comments: true },
            },
            likes: {
              where: { userId: user.id },
              select: { type: true },
            },
          },
        },
        comment: {
          where: {
            author: {
              isBanned: false,
            },
          },
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
            likes: {
              where: { userId: user.id },
              select: { type: true },
            },
          },
        },
      },
    });

    const discussions = allBookmarks
      .filter((b) => b.discussion !== null)
      .map((b) => {
        const d = b.discussion!;
        return {
          ...d,
          isBookmarked: true,
          isLiked: d.likes?.[0]?.type === "like",
          isDisliked: d.likes?.[0]?.type === "dislike",
          likes: undefined,
        };
      });

    const comments = allBookmarks
      .filter((b) => b.comment !== null)
      .map((b) => {
        const c = b.comment!;
        return {
          ...c,
          isBookmarked: true,
          isLiked: c.likes?.[0]?.type === "like",
          isDisliked: c.likes?.[0]?.type === "dislike",
          likes: undefined,
        };
      });

    return NextResponse.json({ discussions, comments }, { status: 200 });
  } catch (error) {
    console.error("Bookmark Fetch Error:", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
