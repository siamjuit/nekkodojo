import { NextResponse } from "next/server";

export async function GET() {
  // You can replace this with your actual leaderboard logic later
  return NextResponse.json({ message: "Leaderboard API" });
}