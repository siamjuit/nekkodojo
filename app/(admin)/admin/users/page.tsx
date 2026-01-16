import { Users, UserX, ShieldAlert, ShieldCheck, Search, Calendar, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminUserCard } from "@/components/Admin/RouteSide/AdminUserCard";
import PaginationControls from "../../../../components/Admin/RouteSide/PaginationControls";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const user = await currentUser();
  if (!user) return null;

  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // 1. Fetch Users
  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        NOT: { id: user.id },
      },
      take: limit,
      skip: skip,
      orderBy: [
        { role: "asc" }, // Admins -> Moderators -> Users
        { createdAt: "desc" },
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

  // 2. Group Users (Segregation Logic)
  const admins = users.filter((u) => u.role === "admin");
  const moderators = users.filter((u) => u.role === "moderator");
  const disciples = users.filter((u) => u.role !== "admin" && u.role !== "moderator");

  const mapToUserProps = (u: any) => ({
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

  // Reusable Row Component for consistency
  const UserRow = ({ u, borderAccent }: { u: any; borderAccent: string }) => (
    <Link
      href={`/${u.name}`}
      className={`
        group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center 
        p-4 rounded-xl border border-[#3e2723] bg-[#1a110d] 
        hover:bg-[#241a15] transition-all duration-300
        border-l-[3px] ${borderAccent} shadow-sm hover:shadow-md
      `}
    >
      {/* 1. User Info */}
      <div className="col-span-1 md:col-span-5 flex items-center gap-4">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-[#3e2723]">
          <AvatarImage src={u.profileUrl || ""} />
          <AvatarFallback className="bg-[#0f0b0a] text-[#d4af37]">
            {u.firstName?.[0] || u.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link href={`/member/${u.name}`} className="font-bold text-[#eaddcf] truncate text-base">
            {u.firstName} {u.lastName}
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#a1887f]">
            <Mail size={12} />
            <span className="truncate max-w-[150px] md:max-w-xs">{u.email}</span>
          </div>
        </div>
      </div>

      {/* 2. Rank Info */}
      <div className="col-span-1 md:col-span-3 flex items-center gap-3">
        {u.beltRank && (
          <Badge
            variant="outline"
            className="border-[#3e2723] text-[#5d4037] font-mono text-[10px]"
          >
            {u.beltRank}
          </Badge>
        )}
      </div>

      {/* 3. Date */}
      <div className="hidden md:col-span-3 md:flex items-center gap-2 text-xs text-[#5d4037]">
        <Calendar size={14} />
        <span>{format(new Date(u.createdAt), "MMM d, yyyy")}</span>
      </div>

      {/* 4. Actions */}
      <div className="col-span-1 text-right flex justify-end">
        <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <AdminUserCard user={mapToUserProps(u)} />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3e2723] pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#3e2723] to-[#1a110d] border border-[#3e2723] text-[#d4af37] shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#eaddcf] tracking-tight">Dojo Roster</h1>
            <p className="text-sm text-[#a1887f] font-mono">
              Managing <span className="text-[#d4af37]">{totalCount}</span> active disciples
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[#3e2723] rounded-2xl bg-[#0f0b0a]/50">
          <div className="p-4 rounded-full bg-[#1a110d] mb-4">
            <UserX className="h-8 w-8 text-[#5d4037]" />
          </div>
          <h3 className="text-lg font-bold text-[#a1887f]">No disciples found</h3>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* 1. ADMINS SECTION */}
          {admins.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-b border-[#3e2723]/50 pb-2">
                <ShieldAlert size={16} className="text-[#d4af37]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">
                  Senseis (Admins)
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-[#d4af37]/10 text-[#d4af37] text-[10px] ml-auto"
                >
                  {admins.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                {admins.map((u) => (
                  <UserRow key={u.id} u={u} borderAccent="border-l-yellow-500" />
                ))}
              </div>
            </section>
          )}

          {/* 2. MODERATORS SECTION */}
          {moderators.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-b border-[#3e2723]/50 pb-2">
                <ShieldCheck size={16} className="text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">
                  Guardians (Moderators)
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 text-[10px] ml-auto"
                >
                  {moderators.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                {moderators.map((u) => (
                  <UserRow key={u.id} u={u} borderAccent="border-l-blue-500" />
                ))}
              </div>
            </section>
          )}

          {/* 3. DISCIPLES SECTION */}
          {disciples.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-b border-[#3e2723]/50 pb-2">
                <Users size={16} className="text-[#a1887f]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#a1887f]">
                  Disciples
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-[#3e2723]/20 text-[#a1887f] text-[10px] ml-auto"
                >
                  {disciples.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                {disciples.map((u) => (
                  <UserRow
                    key={u.id}
                    u={u}
                    borderAccent="border-l-transparent hover:border-l-[#5d4037]"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 flex justify-center border-t border-[#3e2723]">
              <PaginationControls currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
