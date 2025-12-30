import { Prisma } from "@/generated/prisma/client";
import { generateSlug } from "@/lib/actions/makeSlug";
import imagekit from "@/lib/image-kit";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("companyId");

    if (!id) return NextResponse.json("No company provided!", { status: 400 });

    const body = await request.json();
    const { name, logoId, logo, websiteUrl } = body;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json("Name is required!", { status: 400 });
    }

    const oldComp = await prisma.company.findUnique({
      where: { id },
    });

    if (!oldComp) return NextResponse.json("No such company found!", { status: 404 });

    const isReplacing = logoId && oldComp.logoId && logoId !== oldComp.logoId;
    const isDeleting = logoId === null && oldComp.logoId;

    if (isReplacing || isDeleting) {
      await imagekit.deleteFile(oldComp.logoId!).catch((err) => {
        console.error("Image deletion failed (non-critical):", err);
      });
    }
    const slug = generateSlug(name);
    const updateData: any = {
      name,
      slug,
      websiteUrl: websiteUrl === undefined ? undefined : websiteUrl || null,
    };

    if (logo !== undefined) updateData.logo = logo;
    if (logoId !== undefined) updateData.logoId = logoId;

    const updatedComp = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedComp, { status: 200 });
  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json("A company with this name/slug already exists!", { status: 409 });
      }
      if (error.code === "P2025") {
        return NextResponse.json("Company not found!", { status: 404 });
      }
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
