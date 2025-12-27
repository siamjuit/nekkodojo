"use server";

import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the Role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const role = formData.get("role") as string;
    const id = formData.get("id") as string;
    const res = await client.users.updateUserMetadata(id, {
      publicMetadata: { role: role },
    });
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const id = formData.get("id") as string;
    const res = await client.users.updateUserMetadata(id, {
      publicMetadata: { role: null },
    });
    await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/users");
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function deleteDiscussion(formData: FormData) {
  const client = await clerkClient();

  // Security Check
  if (!checkRole("admin")) return { message: "Not Authorized" };

  try {
    const id = formData.get("id") as string;
    const isReported = await prisma.report.findMany({
      where: {
        discussionId: id,
      },
    });

    if (isReported && isReported.length > 0) {
      await prisma.report.updateMany({
        where: {
          discussionId: id,
        },
        data: {
          status: "REVIEWED",
        },
      });
    }
    await prisma.discussions.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    return { message: "Success" };
  } catch (err) {
    console.error(err);
    return { message: "Error deleting discussion" };
  }
}

export async function deleteComment(formData: FormData) {
  const client = await clerkClient();

  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }

  try {
    const id = formData.get("id") as string;
    const isReported = await prisma.report.findMany({
      where: {
        commentId: id,
      },
    });

    if (isReported && isReported.length > 0) {
      await prisma.report.updateMany({
        where: {
          commentId: id,
        },
        data: {
          status: "REVIEWED",
        },
      });
    }
    await prisma.comments.delete({
      where: { id },
    });

    revalidatePath("/admin/comments");
    revalidatePath("/moderator/comments");
    return { message: "Success" };
  } catch (err) {
    console.error(err);
    return { message: "Error deleting comment" };
  }
}

export async function dismissReport(formData: FormData) {
  const client = await clerkClient();
  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }

  try {
    const id = formData.get("id") as string;

    await prisma.report.update({
      where: { id },
      data: { status: "DISMISSED" },
    });

    revalidatePath("/admin/reports");
    revalidatePath("/moderator/reports");
    return { message: "Success" };
  } catch (err) {
    return { message: "Error" };
  }
}
