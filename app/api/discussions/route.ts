import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "top";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const whereClause: Prisma.DiscussionsWhereInput = {
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
    };

    let orderBy: Prisma.DiscussionsOrderByWithRelationInput = {};
    switch (sort) {
      case "latest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "controversial":
        orderBy = { disLikeCount: "desc" };
        break;
      case "top":
      default:
        orderBy = { likeCount: "desc" };
        break;
    }

    const [discussions, total] = await prisma.$transaction([
      prisma.discussions.findMany({
        where: whereClause,
        orderBy: orderBy,
        take: limit,
        skip: skip,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              profileUrl: true,
              beltRank: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      prisma.discussions.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: discussions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json("Failed to fetch discussions!", { status: 500 });
  }
}
