import { CompanyWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("company") || "";

    const whereClause: CompanyWhereInput = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          questions: { some: {} },
        },
      ],
    };

    const allCompanies = await prisma.company.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json(allCompanies, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Failed to get companies", { status: 500 });
  }
}
