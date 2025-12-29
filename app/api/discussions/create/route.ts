import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });
    const body = await request.json();
    const { title, description, authorId, tag, attachments = [] } = body;

    if (!title || !description || !authorId) {
      return NextResponse.json("Missing fields!", { status: 400 });
    }
    const newDiscussion = await prisma.discussion.create({
      data: {
        title,
        description,
        tag: {
          connect: {
            slug: tag.slug,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
        attachments: {
          create: attachments.map((post: any) => ({
            id: post.id,
            postUrl: post.postUrl,
            type: post.type,
          })),
        },
      },
    });

    if (newDiscussion) return NextResponse.json(newDiscussion.id, { status: 200 });
  } catch (error) {
    console.error("Failed to create the discussion!", error);
    return NextResponse.json("Error: failed to create the discussion", { status: 500 });
  }
}
