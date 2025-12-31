import { Prisma } from "@/generated/prisma/client";
import { generateSlug } from "@/lib/actions/makeSlug";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("questionId");
    if (!id || typeof id !== "string") {
      return NextResponse.json("No question provided!", { status: 400 });
    }

    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      externalPlatformUrl,
      solutionUrl,
      categories = [],
      companyTag = [],
    } = body;

    if (
      [title, description, difficulty, externalPlatformUrl, solutionUrl].some(
        (t) => typeof t !== "string" || !t.trim()
      )
    ) {
      return NextResponse.json("All fields are required!", { status: 400 });
    }

    if (!Array.isArray(companyTag) || companyTag.length === 0) {
      return NextResponse.json("At least one Company tag is required!", { status: 400 });
    }

    if (!Array.isArray(categories)) {
      return NextResponse.json("Categories must be a list!", { status: 400 });
    }

    const oldQuestion = await prisma.question.findUnique({
      where: { id },
      select: { title: true, slug: true },
    });

    if (!oldQuestion) {
      return NextResponse.json("Question not found!", { status: 404 });
    }

    let finalSlug = oldQuestion.slug;
    if (title.trim() !== oldQuestion.title) {
      const rawSlug = generateSlug(title);
      finalSlug = `${rawSlug}-${nanoid(5)}`;
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        externalPlatformUrl,
        solutionUrl,
        slug: finalSlug,
        companyTag: {
          set: companyTag.map((ct) => ({
            slug: ct,
          })),
        },
        categories: {
          set: categories.map((cat) => ({
            slug: cat,
          })),
        },
      },
    });

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("UPDATE QUESTION ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json("Invalid Category or Company tag provided.", { status: 400 });
      }
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
