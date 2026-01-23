// app/(admin)/auth/page.tsx
import SudoAuthForm from "@/components/Admin/RouteSide/SudoAuthForm";
import { verifyJWT } from "@/utils/verify-jwt";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminAuthPage() {
  const cookieStore = await cookies();
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const isAuth = await verifyJWT(role);
  if (isAuth) {
    redirect(`/${role}/dashboard`);
  }

  return <SudoAuthForm />;
}
