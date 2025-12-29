import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("questionId");
    if (!id || typeof id !== "string") return NextResponse.json("No question.", { status: 404 });
    await prisma.question.delete({
      where: {
        id,
      },
    });

    return NextResponse.json("Question deleted!", { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json("No such question found!", { status: 404 });
      }
    }
    console.error(error);
    return NextResponse.json("Failed to delete question", { status: 500 });
  }
}
