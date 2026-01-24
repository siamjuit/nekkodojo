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

export async function dismissReport(reportId: string) {
  const client = await clerkClient();
  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: "DISMISSED" },
    });

    revalidatePath("/admin/reports");
    revalidatePath("/moderator/reports");
    return { message: "Success" };
  } catch (err) {
    return { message: "Error" };
  }
}

export async function banUser(userId: string, reportId: string) {
  const client = await clerkClient();
  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }
  try {
    await client.users.banUser(userId);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isBanned: true },
      }),
      prisma.report.update({
        where: { id: reportId },
        data: {
          status: "REVIEWED",
        },
      }),
    ]);

    revalidatePath("/admin/reports");
    revalidatePath("/moderator/reports");
    return { success: true, message: "User banned successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to ban user" };
  }
}

export async function shadowbanUser(userId: string, reportId: string, durationDays: number = 7) {
  const client = await clerkClient();
  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }
  try {
    let metadata: any = { shadowbanned: true };
    if (durationDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + durationDays);
      metadata.shadowbanExpires = expiryDate.getTime();
    }
    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });

    if (reportId)
      await prisma.$transaction([
        prisma.report.update({
          where: { id: reportId },
          data: { status: "REVIEWED" },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            isShadowBanned: true,
          },
        }),
      ]);

    revalidatePath("/admin/reports");
    revalidatePath("/moderator/reports");
    const msg =
      durationDays > 0 ? `Shadowbanned for ${durationDays} days` : "Shadowbanned permanently";
    return { success: true, message: msg };
  } catch (error) {
    return { success: false, message: "Failed to shadowban" };
  }
}

export async function unbanUser(userId: string) {
  const client = await clerkClient();
  if (!checkRole("admin") && !checkRole("moderator")) {
    return { message: "Not Authorized" };
  }
  try {
    await client.users.unbanUser(userId);
    await prisma.user.update({ where: { id: userId }, data: { isBanned: false } });
    return { success: true, message: "User unbanned successfully" };
  } catch (error) {
    console.error("Unban error:", error);
    return { success: false, message: "Failed to unban user" };
  }
}
