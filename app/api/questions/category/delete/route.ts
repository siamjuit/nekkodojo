import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin")
      return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("categoryId");

    if (!id) return NextResponse.json("No category found!", { status: 400 });

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json("Category deleted!", { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json("Category not found!", { status: 404 });
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          "Cannot delete: This category contains questions or is a prerequisite for others.",
          { status: 409 }
        );
      }
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
