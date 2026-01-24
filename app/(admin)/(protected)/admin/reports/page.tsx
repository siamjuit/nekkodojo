import {
  MessageSquareWarning,
  Archive,
  FileText,
  MessageSquare,
  Users,
  ShieldAlert,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { ReportCard } from "@/components/Admin/RouteSide/ReportCard";
import { UserReportCard } from "@/components/Admin/RouteSide/UserReportCard";
import { BannedUserCard } from "@/components/Admin/RouteSide/BannedUserCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminReportsPage() {
  const user = await currentUser();
  if (!user || (!checkRole("admin") && !checkRole("moderator"))) redirect("/");

  // 1. Fetch PENDING User Reports
  const userReports = await prisma.report.findMany({
    where: { status: "PENDING", reportedId: { not: null } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      reported: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileUrl: true,
          email: true,
          isBanned: true,
          isShadowBanned: true, // ✅ FIX 1: Changed from isShadowBanned to isShadowbanned
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const discussionReports = await prisma.report.findMany({
    where: { status: "PENDING", discussionId: { not: null } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      discussion: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const commentReports = await prisma.report.findMany({
    where: { status: "PENDING", commentId: { not: null } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      comment: { select: { id: true, description: true, discussionId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch ALL Banned Users
  const bannedUsers = await prisma.user.findMany({
    where: { isBanned: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileUrl: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch History
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const resolvedReports = await prisma.report.findMany({
    where: { status: { not: "PENDING" }, createdAt: { gte: oneDayAgo } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      discussion: { select: { id: true, title: true } },
      comment: { select: { id: true, description: true, discussionId: true } },
      reported: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileUrl: true,
          email: true,
          isBanned: true,
          isShadowBanned: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const totalCases = discussionReports.length + commentReports.length + userReports.length;

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-[#3e2723] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-900/20 text-red-500 border border-red-900/50">
          <MessageSquareWarning size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#eaddcf] tracking-tight">The Tribunal</h1>
          <p className="text-[#a1887f]">{totalCases} cases require judgment.</p>
        </div>
      </div>

      <Tabs defaultValue="ronins" className="space-y-6">
        <TabsList className="bg-[#1a110d] border border-[#3e2723] p-1 h-auto w-full md:w-auto flex-wrap">
          <TabsTrigger
            value="ronins"
            className="data-[state=active]:bg-[#ef4444] data-[state=active]:text-white text-[#a1887f] gap-2 px-4 py-2"
          >
            <Users size={16} /> Ronins
            {userReports.length > 0 && (
              <span className="ml-1 bg-white/20 px-1.5 rounded text-[10px] font-bold">
                {userReports.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="scrolls"
            className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0f0b0a] text-[#a1887f] gap-2 px-4 py-2"
          >
            <FileText size={16} /> Scrolls
            {discussionReports.length > 0 && (
              <span className="ml-1 bg-[#0f0b0a]/20 px-1.5 rounded text-[10px] font-bold">
                {discussionReports.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="inscriptions"
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white text-[#a1887f] gap-2 px-4 py-2"
          >
            <MessageSquare size={16} /> Inscriptions
            {commentReports.length > 0 && (
              <span className="ml-1 bg-white/20 px-1.5 rounded text-[10px] font-bold">
                {commentReports.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="banned"
            className="data-[state=active]:bg-red-900 data-[state=active]:text-red-100 text-[#5d4037] gap-2 px-4 py-2"
          >
            <ShieldAlert size={16} /> Banned Registry
            {bannedUsers.length > 0 && (
              <span className="ml-1 bg-red-950 px-1.5 rounded text-[10px] font-bold">
                {bannedUsers.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="data-[state=active]:bg-[#3e2723] data-[state=active]:text-[#eaddcf] text-[#5d4037] gap-2 px-4 py-2"
          >
            <Archive size={16} /> Resolved (24h)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ronins" className="space-y-4">
          {userReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userReports.map(
                (r) =>
                  // ✅ FIX 3: Check if reported exists before rendering
                  r.reported && <UserReportCard key={r.id} report={r as any} />
              )}
            </div>
          ) : (
            <EmptyState message="No Ronins flagged." />
          )}
        </TabsContent>

        <TabsContent value="scrolls" className="space-y-4">
          {discussionReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discussionReports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          ) : (
            <EmptyState message="No scrolls flagged." />
          )}
        </TabsContent>

        <TabsContent value="inscriptions" className="space-y-4">
          {commentReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commentReports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          ) : (
            <EmptyState message="No comments flagged." />
          )}
        </TabsContent>

        <TabsContent value="banned" className="space-y-4 animate-in fade-in duration-300">
          {bannedUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannedUsers.map((user) => (
                <BannedUserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <EmptyState message="No users are currently banned." />
          )}
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          {resolvedReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
              {resolvedReports.map((r) =>
                r.reportedId && r.reported ? (
                  <UserReportCard
                    key={r.id}
                    report={r as any}
                  />
                ) : (
                  <ReportCard key={r.id} report={r} />
                )
              )}
            </div>
          ) : (
            <EmptyState message="No history for today." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/20">
      <div className="h-2 w-2 bg-[#5d4037] rounded-full mb-4 animate-pulse" />
      <p className="text-[#a1887f] font-mono uppercase tracking-widest text-xs">{message}</p>
    </div>
  );
}
