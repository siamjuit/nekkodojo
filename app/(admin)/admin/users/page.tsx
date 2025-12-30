import { Users, UserX, ShieldAlert, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
// Ensure this path matches your file structure exactly
import { AdminUserCard } from "@/components/Admin/RouteSide/AdminUserCard"; 
import PaginationControls from "../../../../components/Admin/RouteSide/PaginationControls";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const user = await currentUser();
  if (!user) return null;

  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  // 2. Query with Sort Order: Admin -> Moderator -> User
  // 'admin' starts with A, 'moderator' with M, 'user' with U.
  // So standard alphabetical sort works perfectly!
  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        NOT: { id: user.id }, // Exclude yourself
      },
      take: limit,
      skip: skip,
      orderBy: [
        { role: "asc" }, // Primary Sort: Group by Role
        { createdAt: "desc" }, // Secondary Sort: Newest first within role
      ],
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        beltRank: true,
        profileUrl: true,
        createdAt: true,
        role: true,
      },
    }),
    prisma.user.count({ where: { NOT: { id: user.id } } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // 3. Group the fetched users into buckets
  // Note: This groups the *current page* of results.
  const admins = users.filter((u) => u.role === "admin");
  const moderators = users.filter((u) => u.role === "moderator");
  const disciples = users.filter((u) => u.role !== "admin" && u.role !== "moderator");

  // Helper to map DB result to UserProps safely
  const mapToUserProps = (u: any): UserProps => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    profileUrl: u.profileUrl,
    role: u.role || "user",
    createdAt: u.createdAt,
    name: u.name,
    beltRank: u.beltRank,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#3e2723] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3e2723]/30 text-[#d4af37]">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#d4af37] tracking-tight">Dojo Roster</h1>
          <p className="text-sm text-[#a1887f]">
            Showing {users.length} of {totalCount} total members
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/30">
          <UserX className="h-12 w-12 text-[#5d4037] mb-3" />
          <h3 className="text-lg font-bold text-[#a1887f]">No disciples found</h3>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* --- ADMINS SECTION --- */}
          {admins.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <ShieldAlert size={16} className="text-[#d4af37]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">
                  Senseis (Admins)
                </h2>
                <Badge
                  variant="outline"
                  className="ml-2 border-[#d4af37]/30 text-[#d4af37] text-[10px]"
                >
                  {admins.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {admins.map((u) => (
                  <AdminUserCard user={mapToUserProps(u)} key={u.id} />
                ))}
              </div>
            </section>
          )}

          {/* --- MODERATORS SECTION --- */}
          {moderators.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <ShieldCheck size={16} className="text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">
                  Guardians (Moderators)
                </h2>
                <Badge
                  variant="outline"
                  className="ml-2 border-blue-500/30 text-blue-400 text-[10px]"
                >
                  {moderators.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {moderators.map((u) => (
                  <AdminUserCard user={mapToUserProps(u)} key={u.id} />
                ))}
              </div>
            </section>
          )}

          {/* --- USERS SECTION --- */}
          {disciples.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Users size={16} className="text-[#a1887f]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#a1887f]">
                  Disciples
                </h2>
                <Badge
                  variant="outline"
                  className="ml-2 border-[#3e2723] text-[#a1887f] text-[10px]"
                >
                  {disciples.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {disciples.map((u) => (
                  <AdminUserCard user={mapToUserProps(u)} key={u.id} />
                ))}
              </div>
            </section>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-[#3e2723] mt-8 pt-4 flex justify-center">
              <PaginationControls currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
