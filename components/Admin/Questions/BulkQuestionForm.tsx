import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty } from "@/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json("Payload must be an array", { status: 400 });
    }

    const stats = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const q of body) {
      try {
        let difficulty: Difficulty = "Medium";
        if (q.difficulty) {
          const formatted =
            q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase();
          if (["Easy", "Medium", "Hard"].includes(formatted)) {
            difficulty = formatted as Difficulty;
          }
        }

        await prisma.question.upsert({
          where: { slug: q.slug },
          update: {
            title: q.title,
            description: q.description,
            difficulty: difficulty,
            externalPlatformUrl: q.externalPlatformUrl,
            solutionUrl: q.solutionUrl,
            categories: {
              set: [],
              connect: q.categories.map((c: string) => ({ slug: c })),
            },
            companyTag: {
              set: [],
              connect: q.companies.map((c: string) => ({ slug: c })),
            },
          },
          create: {
            title: q.title,
            slug: q.slug,
            description: q.description,
            difficulty: difficulty,
            externalPlatformUrl: q.externalPlatformUrl,
            solutionUrl: q.solutionUrl,
            categories: {
              connect: q.categories.map((c: string) => ({ slug: c })),
            },
            companyTag: {
              connect: q.companies.map((c: string) => ({ slug: c })),
            },
          },
        });

        stats.success++;
      } catch (error: any) {
        console.error(`Error uploading ${q.slug}:`, error.message);
        stats.failed++;
        if (error.code === "P2025") {
          stats.errors.push(`Failed: ${q.slug} - Missing Category or Company tag in DB`);
        } else {
          stats.errors.push(`Failed: ${q.slug} - ${error.message}`);
        }
      }
    }
    return NextResponse.json(
      {
        message: `Processed. Success: ${stats.success}, Failed: ${stats.failed}`,
        data: stats.errors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FATAL BULK UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Server crashed during upload." }, { status: 500 });
  }
}
