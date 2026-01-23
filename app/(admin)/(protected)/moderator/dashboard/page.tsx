import { 
  ScrollText, 
  MessageSquareWarning, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquareText // Icon for comments
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ActivityChart } from "@/components/Admin/Dashboard/ActivityCharts"; 
import { getWeeklyStats } from "@/lib/activity";

// --- REUSABLE WIDGETS ---

function StatCard({ title, value, icon: Icon, colorClass, subtitle }: any) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#3e2723] bg-[#1a110d] p-6 transition-all hover:border-[#d4af37]/30 hover:shadow-lg hover:shadow-[#d4af37]/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#a1887f] uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-[#eaddcf]">{value}</h3>
          {subtitle && <p className="text-xs text-[#5d4037] mt-1">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-opacity-10 ${colorClass}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color }: any) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#3e2723] last:border-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-opacity-10 ${color}`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#eaddcf] truncate">{text}</p>
        <p className="text-xs text-[#5d4037]">{time}</p>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default async function ModeratorDashboard() {
  const user = await currentUser();
  
  if (!user) redirect("/");
  const role = user.publicMetadata.role as string;
  if (role !== "admin" && role !== "moderator") {
    redirect("/");
  }

  // 1. Fetch Data (Parallel)
  const [
    pendingReports,
    totalScrolls,
    recentScrolls,
    recentComments,
    todaysScrolls,
    chartData
  ] = await Promise.all([
    prisma.report?.count({ where: { status: "PENDING" } }) || 0,
    prisma.discussion.count(),
    
    // Fetch Recent Scrolls
    prisma.discussion.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { title: true, createdAt: true, author: { select: { firstName: true } } }
    }),

    // Fetch Recent Comments (Inscriptions)
    prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { description: true, createdAt: true, author: { select: { firstName: true } } }
    }),

    prisma.discussion.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    }),

    getWeeklyStats()
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#3e2723] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#d4af37] tracking-tight flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-[#d4af37]" />
            Guardian Dashboard
          </h1>
          <p className="text-[#a1887f]">
            Welcome, Guardian. Help us maintain balance in the dojo.
          </p>
        </div>
        
        <div className="hidden md:block">
           <Link href="/moderator/content">
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3e2723]/30 text-[#d4af37] border border-[#3e2723] hover:bg-[#3e2723]/50 transition-colors">
                <ScrollText size={16} />
                <span className="text-sm font-bold">Review Library</span>
             </div>
           </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard 
          title="Active Disturbances" 
          value={pendingReports} 
          subtitle="Reports awaiting judgment"
          icon={MessageSquareWarning} 
          colorClass="bg-red-500 text-red-500" 
        />
        <StatCard 
          title="New Scrolls (Today)" 
          value={todaysScrolls} 
          subtitle="Fresh content to monitor"
          icon={Clock} 
          colorClass="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Total Library" 
          value={totalScrolls} 
          subtitle="Discussions archived"
          icon={ScrollText} 
          colorClass="bg-[#d4af37] text-[#d4af37]" 
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* LEFT: CHART & SCROLLS (2 Cols) */}
        <div className="col-span-2 space-y-8">
           {/* Chart */}
           <ActivityChart chartData={chartData} />

           {/* Fresh Scrolls Feed */}
           <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] p-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-[#eaddcf]">Fresh Scrolls</h2>
               <Link href="/moderator/content" className="text-xs text-[#d4af37] hover:underline flex items-center gap-1">
                 View All <ArrowRight size={12} />
               </Link>
             </div>
             
             <div className="flex flex-col">
               {recentScrolls.length > 0 ? (
                 recentScrolls.map((scroll: any, i: number) => (
                   <ActivityItem 
                     key={i}
                     icon={FileText}
                     text={`"${scroll.title}" by ${scroll.author.firstName}`}
                     time={formatDistanceToNow(new Date(scroll.createdAt)) + " ago"}
                     color="bg-[#d4af37] text-[#d4af37]"
                   />
                 ))
               ) : (
                 <p className="text-sm text-[#5d4037] italic">No scrolls found recently.</p>
               )}
             </div>
           </div>
        </div>

        {/* RIGHT: ACTIONS & INSCRIPTIONS (1 Col) */}
        <div className="space-y-6">
           
           {/* Quick Actions Panel */}
           <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] p-6">
             <h2 className="text-lg font-bold text-[#eaddcf] mb-4">Guardian Actions</h2>
             <div className="space-y-3">
               <Link href="/moderator/reports" className="block w-full">
                 <div className="flex items-center gap-3 rounded-lg border border-[#3e2723] bg-[#0f0b0a] p-4 hover:bg-[#3e2723]/40 hover:border-red-500/50 transition-all group">
                    <MessageSquareWarning size={20} className="text-[#a1887f] group-hover:text-red-500" />
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-[#eaddcf]">The Tribunal</span>
                       <span className="text-xs text-[#5d4037]">Review flagged content</span>
                    </div>
                 </div>
               </Link>
               <Link href="/moderator/content" className="block w-full">
                 <div className="flex items-center gap-3 rounded-lg border border-[#3e2723] bg-[#0f0b0a] p-4 hover:bg-[#3e2723]/40 hover:border-[#d4af37]/50 transition-all group">
                    <ScrollText size={20} className="text-[#a1887f] group-hover:text-[#d4af37]" />
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-[#eaddcf]">Library Patrol</span>
                       <span className="text-xs text-[#5d4037]">Browse latest scrolls</span>
                    </div>
                 </div>
               </Link>
               <div className="p-4 rounded-lg bg-[#3e2723]/10 border border-[#3e2723]/30 mt-4">
                  <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
                     <CheckCircle2 size={16} />
                     <span className="text-xs font-bold uppercase tracking-widest">Status</span>
                  </div>
                  <p className="text-xs text-[#a1887f] leading-relaxed">
                     System is operational. No major raids detected. Continue maintaining peace.
                  </p>
               </div>
             </div>
           </div>

           {/* --- NEW: FRESH INSCRIPTIONS (Fills the gap) --- */}
           <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] p-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-[#eaddcf]">Fresh Inscriptions</h2>
               <Link href="/moderator/comments" className="text-xs text-[#d4af37] hover:underline flex items-center gap-1">
                 View All <ArrowRight size={12} />
               </Link>
             </div>
             
             <div className="flex flex-col">
               {recentComments.length > 0 ? (
                 recentComments.map((comment: any, i: number) => (
                   <ActivityItem 
                     key={i}
                     icon={MessageSquareText}
                     text={`"${comment.description}" by ${comment.author.firstName}`}
                     time={formatDistanceToNow(new Date(comment.createdAt)) + " ago"}
                     color="bg-emerald-500 text-emerald-500" // Emerald Green for Inscriptions
                   />
                 ))
               ) : (
                 <p className="text-sm text-[#5d4037] italic">No inscriptions found recently.</p>
               )}
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}