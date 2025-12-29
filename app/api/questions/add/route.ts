import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      categories,
      externalPlatformUrl,
      solutionUrl,
      topic = [],
      companyTags = [],
    } = await request.json();

    const user = await currentUser();

    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json("Unauthorized!", { status: 401 });
    }

    if (
      [title, description, categories, externalPlatformUrl, solutionUrl].some(
        (t) => !t || !t.trim()
      )
    ) {
      return NextResponse.json("All fields required!", { status: 400 });
    }

    const rawSlug = slugify(title, { lower: true });
    const uniqueId = `${rawSlug}-${nanoid(5)}`;
    const question = await prisma.question.create({
      data: {
        slug: uniqueId,
        title,
        description,
        externalPlatformUrl,
        solutionUrl,
        categories,
        // companyTag: {
        //   create: {
        //     company
        //   }
        // }
      }
    })
    // return NextResponse.json(QuestionStatusType, {status: 201});
  } catch (error) {}
}
