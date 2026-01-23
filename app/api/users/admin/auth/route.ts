import { prisma } from "@/lib/prisma";
import { createJWTToken } from "@/utils/jwtToken";
import { currentUser } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currUser = await currentUser();
    if (!currUser) return NextResponse.json("Unauthorized!", { status: 401 });

    const body = await request.json();
    const { password, role }: { password: string; role: string } = body;

    if (!password || !password.trim() || !role || !role.trim())
      return NextResponse.json("No password or role found!", { status: 404 });

    const user = await prisma.user.findUnique({
      where: { id: currUser.id },
      select: {
        id: true,
        sudoPassword: true,
        role: true,
      },
    });
    if (!user) return NextResponse.json("No user found!", { status: 404 });
    if (!user.sudoPassword)
      return NextResponse.json("You don't have a password, set one!", { status: 400 });
    const correct = await bcrypt.compare(password, user.sudoPassword);

    if (!correct) return NextResponse.json("Wrong password!", { status: 400 });
    if (role !== user.role) return NextResponse.json("Use correct role!", { status: 400 });

    const payload = {
      userId: user.id,
      role: role,
    };
    const token = createJWTToken(payload);
    const cookie = await cookies();
    cookie.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Sudo mode activated" });
  } catch (error) {
    console.error("Sudo login error:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
