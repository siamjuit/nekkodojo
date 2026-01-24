import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface BulkQuestionData {
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  externalPlatformUrl: string;
  solutionUrl: string;
  categories: string[];
  companies: string[];
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    const questions: BulkQuestionData[] = body;

    if (!Array.isArray(questions)) {
      return NextResponse.json("Payload must be an array", { status: 400 });
    }

    const results = await prisma.$transaction(
      questions.map((q) => {
        return prisma.question.upsert({
          where: { slug: q.slug },
          update: {
            title: q.title,
            description: q.description,
            difficulty: q.difficulty,
            externalPlatformUrl: q.externalPlatformUrl,
            solutionUrl: q.solutionUrl,
            categories: {
              connect: q.categories.map((catSlug) => ({ slug: catSlug })),
            },
            companyTag: {
              connect: q.companies.map((compSlug) => ({ slug: compSlug })),
            },
          },
          create: {
            title: q.title,
            slug: q.slug,
            description: q.description,
            difficulty: q.difficulty,
            externalPlatformUrl: q.externalPlatformUrl,
            solutionUrl: q.solutionUrl,
            categories: {
              connect: q.categories.map((catSlug) => ({ slug: catSlug })),
            },
            companyTag: {
              connect: q.companies.map((compSlug) => ({ slug: compSlug })),
            },
          },
        });
      })
    );

    return NextResponse.json({
      message: `Successfully processed ${results.length} questions`,
      data: results,
    });
  } catch (error) {
    console.error("BULK UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Bulk upload failed. Ensure all Category/Company slugs exist." },
      { status: 500 }
    );
  }
}
