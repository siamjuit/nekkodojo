import { currentUser } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json("Unauthorized access!", { status: 401 });
  try {
    const { expire, token, signature } = getUploadAuthParams({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });

    return NextResponse.json({
      expire,
      token,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Error in imagekit auth", error);
    return NextResponse.json("Error: Failed to authenticate imagekit", { status: 500 });
  }
}
