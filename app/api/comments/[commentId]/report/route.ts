import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId: id } = await params;
    const body = await request.json();
    const {reason} = body;
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json({ message: "Reason is required" }, { status: 400 });
    }
    if (reason.length > 500) {
      return NextResponse.json({ message: "Reason is too long" }, { status: 400 });
    }

    const existingReport = await prisma.report.findFirst({
      where: {
        commentId: id,
        reporterId: user.id,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { message: "You have already reported this comment." },
        { status: 409 }
      );
    }
    const report = await prisma.report.create({
      data: {
        commentId: id,
        reporterId: user.id,
        reason: reason.trim(),
      },
    });

    if (!report) throw new Error("Failed to write the report!");

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
