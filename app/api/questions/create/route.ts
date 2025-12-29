import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      externalPlatformUrl,
      solutionUrl,
      companyTag = [],
      categories = [],
    } = body;

    const user = await currentUser();

    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    if (
      [title, description, externalPlatformUrl, solutionUrl].some(
        (t) => typeof t !== "string" || !t.trim()
      )
    ) {
      return NextResponse.json("All fields required!", { status: 400 });
    }

    if (!Array.isArray(companyTag) || companyTag.length === 0) {
      return NextResponse.json("At least one Company tag is required!", { status: 400 });
    }

    if (!Array.isArray(categories)) {
      return NextResponse.json("Categories must be a list!", { status: 400 });
    }

    const rawSlug = slugify(title, { lower: true });
    const uniqueId = `${rawSlug}-${nanoid(5)}`;
    const question = await prisma.question.create({
      data: {
        slug: uniqueId,
        title,
        description,
        externalPlatformUrl,
        solutionUrl,
        difficulty,
        categories: {
          connect: categories.map((cat: string) => ({
            slug: cat,
          })),
        },
        companyTag: {
          connect: companyTag.map((comp: string) => ({
            slug: comp,
          })),
        },
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Failed to add this question.", { status: 500 });
  }
}
