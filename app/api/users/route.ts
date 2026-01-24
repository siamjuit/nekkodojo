import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.length < 2) return NextResponse.json([]);

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            isBanned: false,
          },
        ],
      },
      take: 12,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        profileUrl: true,
        beltRank: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error!", { status: 500 });
  }
}
