import { Prisma, TagType } from "@/generated/prisma/client";
import { fetchItems } from "@/lib/actions/caching";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await currentUser();

    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    const query = searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "top";
    const tagParams = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const cacheKey = `discussions:q=${query}:s=${sort}:t=${tagParams}:p=${page}:l=${limit}:u=${user.id}`;
    const responseData = await fetchItems({
      key: cacheKey,
      expires: 60 * 2,
      fetcher: async () => {
        const shadowbanFilter: Prisma.DiscussionWhereInput = user
          ? {
              OR: [{ author: { isShadowBanned: false } }, { authorId: user.id }],
            }
          : { author: { isShadowBanned: false } };
        const whereClause: Prisma.DiscussionWhereInput = {
          AND: [
            {
              author: {
                isBanned: false,
              },
            },
            shadowbanFilter,
            query
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    {
                      author: {
                        OR: [
                          { firstName: { contains: query, mode: "insensitive" } },
                          { lastName: { contains: query, mode: "insensitive" } },
                          { name: { contains: query, mode: "insensitive" } },
                        ],
                      },
                    },
                  ],
                }
              : {},

            tagParams
              ? {
                  tag: {
                    slug: tagParams,
                  },
                }
              : {},
          ],
        };

        let orderBy: any = { createdAt: "desc" };
        switch (sort) {
          case "latest":
            orderBy = { createdAt: "desc" };
            break;

          case "oldest":
            orderBy = { createdAt: "asc" };
            break;

          case "controversial":
            orderBy = [{ dislikeCount: "desc" }, { comments: { _count: "desc" } }];
            break;

          case "top":
          default:
            orderBy = [{ likeCount: "desc" }, { comments: { _count: "desc" } }];
            break;
        }

        const [discussions, total] = await prisma.$transaction([
          prisma.discussion.findMany({
            where: whereClause,
            orderBy: orderBy,
            take: limit,
            skip: skip,
            include: {
              tag: true,
              author: {
                select: {
                  name: true,
                  firstName: true,
                  lastName: true,
                  profileUrl: true,
                  beltRank: true,
                  isShadowBanned: true,
                },
              },
              _count: {
                select: {
                  comments: true,
                  likes: true,
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
              likes: {
                where: {
                  userId: user.id,
                },
                select: {
                  type: true,
                },
              },
            },
          }),
          prisma.discussion.count({ where: whereClause }),
        ]);

        const discussionsWithStatus = discussions.map((d) => {
          const isBookmarked = d.bookmarks.length > 0;
          const userVote = d.likes[0]?.type;
          return {
            ...d,
            isBookmarked,
            isLiked: userVote === "like",
            isDisliked: userVote === "dislike",
            bookmarks: undefined,
            likes: undefined,
          };
        });
        return {
          data: discussionsWithStatus,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
    });
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json("Failed to fetch discussions!", { status: 500 });
  }
}
