import { QuestionWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category");
    const company = searchParams.get("company");

    const whereClause: QuestionWhereInput = {
      AND: [
        category && category !== "all"
          ? {
              categories: {
                some: {
                  slug: category,
                },
              },
            }
          : {},

        company
          ? {
              companyTag: {
                some: {
                  slug: company,
                },
              },
            }
          : {},

        query
          ? {
              title: {
                contains: query,
                mode: "insensitive",
              },
            }
          : {},
      ],
    };
    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        categories: { select: { name: true, slug: true } },
        companyTag: { select: { name: true, slug: true, logo: true } },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);
    return NextResponse.json("Failed to fetch questions", { status: 500 });
  }
}
