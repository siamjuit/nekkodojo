import { 
  MessageSquareWarning, 
  Archive, 
  FileText, 
  MessageSquare 
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { ReportCard } from "@/components/Admin/RouteSide/ReportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminReportsPage() {
  const user = await currentUser();
  if (!user || (!checkRole("admin") && !checkRole("moderator"))) redirect("/");

  // 1. Fetch Active Discussion Reports
  const discussionReports = await prisma.report.findMany({
    where: { status: "PENDING", discussionId: { not: null } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      discussion: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  // 2. Fetch Active Comment Reports
  const commentReports = await prisma.report.findMany({
    where: { status: "PENDING", commentId: { not: null } },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      comment: { select: { id: true, description: true, discussionId: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  // 3. Fetch Resolved History (Last 24h)
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const resolvedReports = await prisma.report.findMany({
    where: {
      status: { not: "PENDING" },
      createdAt: { gte: oneDayAgo }
    },
    include: {
      reporter: { select: { firstName: true, lastName: true, profileUrl: true } },
      discussion: { select: { id: true, title: true } },
      comment: { select: { id: true, description: true, discussionId: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20 // Limit to prevent clutter
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-[#3e2723] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-900/20 text-red-500 border border-red-900/50">
          <MessageSquareWarning size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#eaddcf] tracking-tight">The Tribunal</h1>
          <p className="text-[#a1887f]">
            {discussionReports.length + commentReports.length} cases require judgment.
          </p>
        </div>
      </div>

      {/* TABS INTERFACE */}
      <Tabs defaultValue="scrolls" className="space-y-6">
        
        <TabsList className="bg-[#1a110d] border border-[#3e2723] p-1 h-auto w-full md:w-auto flex-wrap">
          <TabsTrigger 
            value="scrolls" 
            className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0f0b0a] text-[#a1887f] gap-2 px-4 py-2"
          >
            <FileText size={16} /> Scrolls ({discussionReports.length})
          </TabsTrigger>
          <TabsTrigger 
            value="inscriptions" 
            className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white text-[#a1887f] gap-2 px-4 py-2"
          >
            <MessageSquare size={16} /> Inscriptions ({commentReports.length})
          </TabsTrigger>
          <TabsTrigger 
            value="archive" 
            className="data-[state=active]:bg-[#3e2723] data-[state=active]:text-[#eaddcf] text-[#5d4037] gap-2 px-4 py-2"
          >
            <Archive size={16} /> Resolved (24h)
          </TabsTrigger>
        </TabsList>

        {/* --- SCROLLS CONTENT --- */}
        <TabsContent value="scrolls" className="space-y-4 animate-in fade-in duration-300">
          {discussionReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discussionReports.map(r => (
                // @ts-ignore - Types inferred from Prisma include above
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          ) : (
            <EmptyState message="No scrolls flagged." />
          )}
        </TabsContent>

        {/* --- INSCRIPTIONS CONTENT --- */}
        <TabsContent value="inscriptions" className="space-y-4 animate-in fade-in duration-300">
          {commentReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commentReports.map(r => (
                // @ts-ignore
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          ) : (
            <EmptyState message="No comments flagged." />
          )}
        </TabsContent>

        {/* --- ARCHIVE CONTENT --- */}
        <TabsContent value="archive" className="space-y-4 animate-in fade-in duration-300">
          {resolvedReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
              {resolvedReports.map(r => (
                // @ts-ignore
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          ) : (
            <EmptyState message="No history for today." />
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

// Simple Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/20">
      <div className="h-2 w-2 bg-[#5d4037] rounded-full mb-4 animate-pulse" />
      <p className="text-[#a1887f] font-mono">{message}</p>
    </div>
  );
}