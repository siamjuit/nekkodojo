import { ShelfType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const type = searchParams.get("type")?.toLowerCase() || "revisit";

    if (!questionId || !questionId.trim())
      return NextResponse.json("Question not found!", { status: 404 });

    if (!Object.keys(ShelfType).includes(type)) {
      return NextResponse.json("Invalid shelf type.", { status: 400 });
    }
    const shelfType = type as ShelfType;
    const isShelved = await prisma.shelf.findUnique({
      where: {
        questionId_userId: { questionId, userId: user.id },
      },
    });

    if (!isShelved) {
      const shelved = await prisma.shelf.create({
        data: {
          questionId,
          userId: user.id,
          type: shelfType,
        },
      });

      return NextResponse.json(shelved, { status: 201 });
    }
    if (isShelved && isShelved.type === shelfType) {
      await prisma.shelf.delete({
        where: {
          id: isShelved.id,
        },
      });

      return NextResponse.json("Unshelved from revisited!", { status: 200 });
    }

    const shelved = await prisma.shelf.update({
      where: {
        id: isShelved.id,
      },
      data: {
        type: shelfType,
      },
    });

    return NextResponse.json(shelved, { status: 200 });
  } catch (error) {
    console.log("Error Occured", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const allShelfItems = await prisma.shelf.findMany({
      where: {
        userId: user.id,
      },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            externalPlatformUrl: true,
            solutionUrl: true,
            description: true,
            difficulty: true,
            categories: true,
          },
        },
      },
    });

    return NextResponse.json(allShelfItems, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error.", { status: 500 });
  }
}
