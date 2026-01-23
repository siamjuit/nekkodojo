import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface PassProps {
  oldPass: string;
  newPass: string;
  confirmPass: string;
}

export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const body = await request.json();
    const { oldPass, newPass, confirmPass }: PassProps = body;
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "user";
    console.log(oldPass, newPass, confirmPass, role);

    if (!role || role === "user" || !["admin", "moderator"].includes(role)) {
      return NextResponse.json("You are not authorized to access this area!", { status: 401 });
    }

    if ([oldPass, newPass, confirmPass].some((t) => typeof t !== "string" || !t || !t.trim())) {
      return NextResponse.json("No passwords provided!", { status: 400 });
    }

    if (newPass !== confirmPass)
      return NextResponse.json("New password doesn't match!", { status: 400 });

    if (newPass.length < 6)
      return NextResponse.json("Minimum length for the password is 6 characters!", { status: 400 });

    const member = await prisma.user.findUnique({
      where: { id: user.id },
      select: { sudoPassword: true, id: true },
    });

    if (!member) return NextResponse.json("No such user found with this role!", { status: 404 });

    if (!member.sudoPassword)
      return NextResponse.json("You don't have a password set. Contact administration.", {
        status: 400,
      });

    const isCorrect = await bcrypt.compare(oldPass, member.sudoPassword);

    if (!isCorrect) return NextResponse.json("Old password didn't match!", { status: 400 });
    if (oldPass === newPass)
      return NextResponse.json("New password can't be same as the old one!", { status: 400 });
    const newSudoPass = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
      where: { id: member.id },
      data: {
        sudoPassword: newSudoPass,
      },
    });
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
