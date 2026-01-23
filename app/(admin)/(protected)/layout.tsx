import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { verifyJWT } from "@/utils/verify-jwt";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/Admin/RouteSide/AdminSidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/");
  const role = (user.publicMetadata.role as string) || "user";
  const isAuthorized = await verifyJWT(role);
  if (!isAuthorized) {
    redirect("/auth");
  }
  return <AdminShell role={role}>{children}</AdminShell>;
}
