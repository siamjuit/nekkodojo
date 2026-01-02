import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Users API is working" });
}