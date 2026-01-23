"use server";

import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { sendSudoPasswordEmail } from "@/utils/roleEmail";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the Role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const role = formData.get("role") as string;
    const id = formData.get("id") as string;
    const user = await client.users.getUser(id);
    const primaryEmailId = user.primaryEmailAddressId;
    const primaryEmail = user.emailAddresses.find((e) => e.id === primaryEmailId);
    if (!primaryEmail) {
      return { message: "User has no primary email to send password to." };
    }
    console.log(primaryEmail);
    const password = id.slice(0, 3) + nanoid(5);
    const sudoPassword = await hash(password, 10);
    const res = await client.users.updateUserMetadata(id, {
      publicMetadata: { role: role },
    });
    await prisma.user.update({
      where: { id },
      data: { role, sudoPassword },
    });
    client.users.updateUserMetadata(id, {
      privateMetadata: { sudoPassword: password },
    });
    const emailResult = await sendSudoPasswordEmail(primaryEmail.emailAddress, role, password);
    if (!emailResult.success) {
      console.error("Email failed to send:", emailResult.error);
      return {
        success: true,
        message: `Role updated, but email failed. Copy this password manually: ${password}`,
      };
    }
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
      data: { role: "user", sudoPassword: null },
    });
    client.users.updateUserMetadata(id, {
      privateMetadata: { sudoPassword: null },
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
    await prisma.discussion.delete({
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
    await prisma.comment.delete({
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
