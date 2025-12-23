import { buildCommentTree } from "@/lib/comment-tree";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });
    const discussionId = searchParams.get("discussionId");
    const sort = searchParams.get("sort") || "top";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!discussionId) return NextResponse.json("No discussion found!", { status: 404 });

    const orderBy =
      sort === "top"
        ? [{ likeCount: "desc" }, { replies: { _count: "desc" } }]
        : { createdAt: "desc" };

    const skip = (page - 1) * limit;

    const comments = await prisma.comments.findMany({
      where: {
        discussionId: discussionId,
      },
      take: limit,
      skip: skip,
      orderBy: orderBy as any,
      include: {
        author: {
          select: {
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
        },
        bookmarks: {
          where: {
            userId: user.id,
          },
        },
      },
    });
    const commentsWithStatus = comments.map((comment) => {
      const userVote = comment.likes[0];
      const isBookmarked = comment.bookmarks.length > 0;
      return {
        ...comment,
        isLiked: userVote?.type === "like",
        isDisliked: userVote?.type === "dislike",
        isBookmarked,
        likes: undefined,
        bookmarks: undefined,
      };
    });
    const totalComments = await prisma.comments.count({
      where: {
        discussionId,
      },
    });

    const hasMore = totalComments > comments.length;
    const data = buildCommentTree(commentsWithStatus);
    return NextResponse.json(
      {
        data,
        meta: {
          total: totalComments,
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
