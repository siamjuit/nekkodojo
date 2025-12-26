import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user?.publicMetadata.role !== "admin")
      return NextResponse.json("Unauthorized Role!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * 50;

    const allUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      skip,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        beltRank: true,
        profileUrl: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });

    if (!allUsers || allUsers.length === 0)
      return NextResponse.json("No users found!", { status: 404 });

    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json("Failed to get all the users", { status: 500 });
  }
}
