import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface DiscussionProps {
  title: string;
  description: string;
  attachment: [
    {
      postUrl: string;
      type: "image" | "video";
    },
  ];
  authorId: string;
}

export async function POST(request: Request) {
  try {
    const { title, description, authorId, attachments = [] } = await request.json();

    if (!title || !description || !authorId) {
      return NextResponse.json("Missing fields!", { status: 400 });
    }
    const newDiscussion = await prisma.discussions.create({
      data: {
        title,
        description,
        authorId: authorId,
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
