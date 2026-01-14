import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    await prisma.userProgress.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json("Progress deleted!", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error.", { status: 500 });
  }
}
