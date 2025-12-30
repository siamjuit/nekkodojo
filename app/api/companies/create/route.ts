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
    const { name, slug, logoId, logo, websiteUrl } = body;

    if ([name, slug].some((t) => typeof t !== "string" || !t.trim())) {
      return NextResponse.json("All fields required!", { status: 400 });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        slug,
        logoId: logoId || null,
        logo: logo || null,
        websiteUrl: websiteUrl || null,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json("A company with this Name, Slug, or Logo already exists!", {
          status: 409,
        });
      }
    }

    return NextResponse.json("Failed to register company!", { status: 500 });
  }
}
