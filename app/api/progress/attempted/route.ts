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
    });
    if (existingProgress) {
      return NextResponse.json(existingProgress, { status: 200 });
    }
    const newProgress = await prisma.userProgress.create({
      data: {
        userId: user.id,
        questionId: qId,
        status: "attempted",
      },
    });

    return NextResponse.json(newProgress, { status: 200 });
  } catch (error) {
    console.error("[PROGRESS_ATTEMPT_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
