import imagekit from "@/lib/image-kit";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("commentId");
    if (!id) return NextResponse.json("No such comment found!", { status: 404 });

    const res = await prisma.comment.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
        attachments: true,
        discussion: {
          select: {
            id: true,
            authorId: true,
          },
        },
      },
    });
    if (!res) return NextResponse.json("No such comment.", { status: 404 });
    if (res.authorId !== user.id && res.discussion.authorId !== user.id) {
      return NextResponse.json("You are not the author of this comment!", { status: 403 });
    } else {
      if (res.attachments) await imagekit.deleteFile(res.attachments.id);

      await prisma.comment.delete({
        where: { id, authorId: res.authorId },
      });
    }
    return NextResponse.json("Comment deleted!", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Failed to delete the comment!", { status: 500 });
  }
}
