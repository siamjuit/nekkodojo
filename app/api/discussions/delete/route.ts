import imagekit from "@/lib/image-kit";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });
    const { searchParams } = new URL(request.url);
    const discussionId = searchParams.get("discussionId");
    
    if (!discussionId) return NextResponse.json("No discussion selected", { status: 400 });

    const discussion = await prisma.discussion.findUnique({
      where: {
        id: discussionId,
      },
      select: {
        authorId: true,
        attachments: true,
      },
    });

    if (discussion) {
      if (user.id !== discussion.authorId) {
        return NextResponse.json("You are not the author of this discussion!", { status: 403 });
      } else {
        const fileIds = discussion.attachments.map((att) => att.id);
        await imagekit.bulkDeleteFiles(fileIds);
        await prisma.discussion.delete({
          where: {
            id: discussionId,
            authorId: user.id,
          },
        });
        return NextResponse.json("Discussion deleted!", { status: 200 });
      }
    }
    return NextResponse.json("No discussion found!", { status: 404 });
  } catch (error) {
    return NextResponse.json("Failed to delete the discussion!", { status: 500 });
  }
}
