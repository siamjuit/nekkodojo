import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuestionsDashboard from "@/components/Admin/RouteSide/QuestionDashboard"; 

export default async function QuestionsAdminPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#eaddcf]">Questions Dashboard</h1>
        <p className="text-[#a1887f] mt-2">
          Manage your problem set, organize categories, and track company tags.
        </p>
      </div>
      
      <QuestionsDashboard />
    </div>
  );
}