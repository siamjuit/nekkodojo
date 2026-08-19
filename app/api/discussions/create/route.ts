import { deleteCacheByPrefix } from "@/lib/actions/caching";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type DiscussionAttachmentInput = {
  id: string;
  postUrl: string;
  type: string;
};

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
          create: attachments.map((post: DiscussionAttachmentInput) => ({
            id: post.id,
            postUrl: post.postUrl,
            type: post.type,
          })),
        },
      },
    });

    if (newDiscussion) {
      try {
        await deleteCacheByPrefix("discussions:");
      } catch (error) {
        console.error("Discussion list cache invalidation failed:", error);
      }
      return NextResponse.json(newDiscussion.id, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to create the discussion!", error);
    return NextResponse.json("Error: failed to create the discussion", { status: 500 });
  }
}
