import imagekit from "@/lib/image-kit";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let attId = "";
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const body = await request.json();
    const { description, discussionId, attachment, parentId } = body;
    if (!description || !discussionId) {
      return NextResponse.json("Invalid comment!", { status: 400 });
    }
    if (attachment) attId = attachment.id;
    const attachmentData = attachment
      ? {
          attachments: {
            create: {
              id: attachment.id,
              postUrl: attachment.postUrl,
              type: attachment.type,
            },
          },
        }
      : {};
    const newComment = await prisma.comment.create({
      data: {
        description,
        authorId: user.id,
        discussionId: discussionId,
        parentId: parentId || null,
        ...attachmentData,
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
        attachments: true,
      },
    });

    if (!newComment) {
      throw new Error("Failed to make the comment");
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    imagekit.deleteFile(attId);
    return NextResponse.json(error, { status: 500 });
  }
}
