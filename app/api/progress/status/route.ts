import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const qId = searchParams.get("questionId");

    if (!qId) return NextResponse.json("No question selected!", { status: 400 });

    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_questionId: { userId: user.id, questionId: qId },
      },
      select: {
        status: true,
      },
    });

    if (!existingProgress) {
      return NextResponse.json("Attempt the question first!", { status: 404 });
    }

    const currentStatus = existingProgress.status;
    const newStatus = currentStatus === "completed" ? "attempted" : "completed";
    let countUpdate = undefined;

    if (newStatus === "completed" && currentStatus !== "completed") {
      countUpdate = { increment: 1 };
    } else if (currentStatus === "completed" && newStatus !== "completed") {
      countUpdate = { decrement: 1 };
    }
    const [updatedProgress, updatedSolved] = await prisma.$transaction([
      prisma.userProgress.update({
        where: {
          userId_questionId: { userId: user.id, questionId: qId },
        },
        data: {
          status: newStatus,
        },
      }),

      prisma.user.update({
        where: { id: user.id },
        data: {
          noOfQuestionsSolved: countUpdate,
        },
      }),
    ]);
    return NextResponse.json(updatedProgress, { status: 200 });
  } catch (error) {
    console.error("[PROGRESS_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
