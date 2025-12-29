import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const { name, slug, color } = body;

    if ([name, slug, color].some((t) => typeof t !== "string" || !t.trim())) {
      return NextResponse.json("All fields are required!", { status: 400 });
    }
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json("A tag with this slug already exists!", { status: 409 });
      }
    }
    return NextResponse.json("Failed to create the tag.", { status: 500 });
  }
}
