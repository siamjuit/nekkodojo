"use server"

import { prisma } from "@/lib/prisma";

export async function getTags() {
  const tags = await prisma.tag.findMany({
    select: {
      name: true,
      slug: true,
      color: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return tags;
}
