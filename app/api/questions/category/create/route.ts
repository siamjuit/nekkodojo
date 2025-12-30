import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, slug, categoryOrder, prerequisiteArray = [] } = body;

    if (!name || !slug || categoryOrder === undefined) {
      return NextResponse.json("Name, Slug, and Order are required!", { status: 400 });
    }

    if (typeof categoryOrder !== "number") {
      return NextResponse.json("Category Order must be a number!", { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        categoryOrder,
        prerequisiteArray: {
          connect: prerequisiteArray.map((preSlug: string) => ({
            slug: preSlug,
          })),
        },
      },
    });

    if (!newCategory)
      return NextResponse.json("Couldn't create the new category!", { status: 400 });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Failed to add the category. Prerequisite might not exist.", {
      status: 500,
    });
  }
}
