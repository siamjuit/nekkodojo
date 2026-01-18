import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const body = await request.json();
    const { platform, platformUrl } = body;

    const social = await prisma.socialLink.create({
      data: {
        userId: user.id,
        platform,
        platformUrl,
      },
    });

    if (!social) return NextResponse.json("Couldn't add the social link!", { status: 400 });

    return NextResponse.json(social, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error.", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const allLinks = await prisma.socialLink.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        platform: true,
        platformUrl: true,
      },
    });

    return NextResponse.json(allLinks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error!", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("id");

    if (!linkId || !linkId.trim())
      return NextResponse.json("Social link not found!", { status: 404 });

    const { platform, platformUrl } = await request.json();

    const updatedSocial = await prisma.socialLink.update({
      where: {
        id: linkId,
      },
      data: {
        platform,
        platformUrl,
      },
    });

    return NextResponse.json("Link updated!", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error!", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unauthorized!", { status: 401 });

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("id");

    if (!linkId || !linkId.trim())
      return NextResponse.json("Social link not found!", { status: 404 });

    await prisma.socialLink.delete({ where: { id: linkId } });

    return NextResponse.json("Link removed!", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error!", { status: 500 });
  }
}
