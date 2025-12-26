import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { ShieldAlert, User } from "lucide-react";
import { UserRoleCard } from "../_components/UserRoleCard"; // Import the new component

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;
  const client = await clerkClient();
  const users = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] p-6 md:p-10 space-y-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto space-y-2 border-b border-[#3e2723] pb-6">
        <h1 className="text-4xl font-black text-[#d4af37] tracking-tight flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-[#d4af37]" />
          Dojo Administration
        </h1>
        <p className="text-[#a1887f] text-lg max-w-2xl">
          Search for disciples and manage their permissions. <br />
          <span className="text-xs uppercase tracking-widest text-[#5d4037]">
            Restricted Access Area
          </span>
        </p>
      </div>

      {/* SEARCH SECTION */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="w-full md:w-auto">
            <SearchUsers />
          </div>
          {query && (
            <p className="text-sm text-[#a1887f] font-mono">
              Found {users.length} {users.length === 1 ? "result" : "results"} for &quot;{query}
              &quot;
            </p>
          )}
        </div>
      </div>

      {/* USERS GRID */}
      <div className="max-w-5xl mx-auto">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#3e2723] rounded-2xl bg-[#1a110d]/30">
            <div className="bg-[#3e2723]/20 p-6 rounded-full mb-4">
              <User className="h-12 w-12 text-[#5d4037]" />
            </div>
            <h3 className="text-xl font-bold text-[#a1887f]">No Disciples Found</h3>
            <p className="text-[#5d4037] text-sm mt-2">
              {query
                ? "Try adjusting your search terms."
                : "Enter a name or email to begin moderation."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
              const currentRole = (user.publicMetadata.role as string) || "user";
              const email = user.emailAddresses.find(
                (e) => e.id === user.primaryEmailAddressId
              )?.emailAddress;

              return (
                <UserRoleCard
                  key={user.id}
                  user={{
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    email: email,
                    initialRole: currentRole,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
