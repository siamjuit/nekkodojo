import { Prisma } from "@/generated/prisma/client";
import imagekit from "@/lib/image-kit";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("companyId");

    if (!id) return NextResponse.json("No company provided!", { status: 400 });

    const comp = await prisma.company.findUnique({
      where: { id },
      select: { logoId: true },
    });
    if (!comp) {
      return NextResponse.json("Company not found!", { status: 404 });
    }
    if (comp && comp.logoId) {
      await imagekit.deleteFile(comp.logoId).catch((err) => {
        console.error("Failed to delete image from ImageKit:", err);
      });
    }
    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json("Company deleted!", { status: 200 });
  } catch (error) {
    console.error("DELETE COMPANY ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json("Company not found!", { status: 404 });
      }
      if (error.code === "P2003") {
        return NextResponse.json("Cannot delete: This company has questions attached to it.", {
          status: 409,
        });
      }
    }

    return NextResponse.json("Failed to delete company.", { status: 500 });
  }
}
