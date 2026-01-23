// app/(admin)/auth/page.tsx
import SudoAuthForm from "@/components/Admin/RouteSide/SudoAuthForm"; 
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminAuthPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("auth_token")) {
    redirect("/admin/dashboard");
  }

  return <SudoAuthForm />;
}
