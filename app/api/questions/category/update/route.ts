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
    const id = searchParams.get("categoryId");

    if (!id) return NextResponse.json("No category found!", { status: 400 });

    const body = await request.json();
    const { name, categoryOrder, prerequisiteArray = [] } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      categoryOrder === undefined ||
      typeof categoryOrder !== "number"
    )
      return NextResponse.json("Name (string) and Order (number) are required!", { status: 400 });

    const slug = generateSlug(name);

    const updatedCat = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        categoryOrder,
        prerequisiteArray: {
          set: prerequisiteArray.map((preSlug: string) => ({
            slug: preSlug,
          })),
        },
      },
    });

    return NextResponse.json(updatedCat, { status: 200 });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json("A category with this name/slug already exists!", { status: 409 });
      }
      if (error.code === "P2025") {
        return NextResponse.json("Category not found!", { status: 404 });
      }
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
