import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId: id } = await params;
    if (!id) return NextResponse.json("No discussion with this ID found!", { status: 400 });

    const discussion = await prisma.discussions.findUnique({
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
      },
    });

    if (!discussion) return NextResponse.json("No such discussion!", { status: 404 });
    return NextResponse.json(discussion);
  } catch (error) {
    return NextResponse.json("Failed to fetch this discussion!", { status: 500 });
  }
}
