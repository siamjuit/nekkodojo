import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized", { status: 401 });

    const { bio } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio: bio,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_BIO]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
