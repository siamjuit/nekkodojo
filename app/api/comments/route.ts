import { buildCommentTree } from "@/lib/comment-tree";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discussionId = searchParams.get("discussionId");
    const sort = searchParams.get("sort") || "top";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });
    if (!discussionId) return NextResponse.json("No discussion found!", { status: 404 });

    const totalRoots = await prisma.comments.count({
      where: {
        discussionId,
        parentId: null,
      },
    });
    const orderBy =
      sort === "top"
        ? [{ likeCount: "desc" }, { replies: { _count: "desc" } }]
        : { createdAt: "desc" };

    const rootComments = await prisma.comments.findMany({
      where: {
        discussionId: discussionId,
        parentId: null,
      },
      take: limit,
      skip: skip,
      orderBy: orderBy as any,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            beltRank: true,
            profileUrl: true,
          },
        },
        attachments: true,
        _count: {
          select: {
            replies: true,
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
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const allReplies = await prisma.comments.findMany({
      where: {
        discussionId,
        parentId: { not: null },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            profileUrl: true,
            beltRank: true,
          },
        },
        _count: {
          select: { replies: true },
        },
        likes: { where: { userId: user.id }, select: { type: true } },
        bookmarks: { where: { userId: user.id }, select: { id: true } },
        attachments: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const combinedComments = [...rootComments, ...allReplies];

    const processedComments = combinedComments.map((comment) => ({
      ...comment,
      isLiked: comment.likes[0]?.type === "like",
      isDisliked: comment.likes[0]?.type === "dislike",
      isBookmarked: comment.bookmarks.length > 0,
      likes: undefined,
      bookmarks: undefined,
    }));

    const totalComments = await prisma.comments.count({
      where: {
        discussionId,
      },
    });

    const hasMore = skip + rootComments.length < totalRoots;
    const data = buildCommentTree(processedComments);
    return NextResponse.json(
      {
        data,
        meta: {
          total: totalComments,
          totalRoots,
          hasMore,
          page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FETCH COMMENTS ERROR:", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
