import { generateSlug } from "@/lib/actions/makeSlug";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin")
      return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("tagId");

    if (!id) return NextResponse.json("No tag found!", { status: 400 });

    const body = await request.json();
    const { name, color } = body;

    if ([name, color].some((t) => typeof t !== "string" || !t.trim()))
      return NextResponse.json("Name and color are required!", { status: 400 });

    const slug = generateSlug(name);

    const updatedTag = await prisma.tag.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        color,
      },
    });

    return NextResponse.json(updatedTag, { status: 200 });
  } catch (error) {
    console.error("UPDATE TAG ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json("A tag with this name/slug already exists!", { status: 409 });
      }
      if (error.code === "P2025") {
        return NextResponse.json("Category not found!", { status: 404 });
      }
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
