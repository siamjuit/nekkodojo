import {
  Users,
  ShieldAlert,
  Search,
  ScrollText,
  MessageSquareWarning,
  TrendingUp,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Settings,
  Activity,
  User
} from "lucide-react";
import { prisma } from "@/lib/prisma"; // Direct DB access
import { clerkClient } from "@clerk/nextjs/server";
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Components
import { SearchUsers } from "../../_components/SearchUsers";
import { UserRoleCard } from "../../_components/UserRoleCard";
import { ActivityChart } from "../../_components/ActivityCharts"; 
import { getWeeklyStats } from "@/lib/activity";

// --- WIDGETS ---

function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#3e2723] bg-[#1a110d] p-6 transition-all hover:border-[#d4af37]/30 hover:shadow-lg hover:shadow-[#d4af37]/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#a1887f] uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-[#eaddcf]">{value}</h3>
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

// --- MAIN PAGE ---

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;

  // 1. FETCH DATA (Parallelized)
  const client = await clerkClient();
  const [
    userCount,
    scrollCount,
    reportCount,
    todaysJoiners,
    recentUsers,
    chartData
  ] = await Promise.all([
    // A. Stats
    prisma.user.count(),
    prisma.discussions.count(),
    prisma.report?.count({ where: { status: "PENDING" } }) || 0,
    prisma.user.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    }),
    
    // B. Recent Activity List
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true, createdAt: true }
    }),

    // C. Chart Data
    getWeeklyStats(),
  ]);

  // 2. SEARCH LOGIC (Existing Feature)
  // Only fetch Clerk users if we are actually searching
  const searchedUsers = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* --- 1. HEADER & VITALS --- */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-[#3e2723] pb-6">
          <h1 className="text-4xl font-black text-[#d4af37] tracking-tight flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-[#d4af37]" />
            Dojo Command
          </h1>
          <p className="text-[#a1887f]">
            System status and disciple management.
          </p>
        </div>

        {/* Stats Grid (Always Visible) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Disciples" 
            value={userCount} 
            icon={Users} 
            colorClass="bg-blue-500 text-blue-500" 
          />
          <StatCard 
            title="Scrolls Library" 
            value={scrollCount} 
            icon={ScrollText} 
            colorClass="bg-[#d4af37] text-[#d4af37]" 
          />
          <StatCard 
            title="Open Reports" 
            value={reportCount} 
            icon={MessageSquareWarning} 
            colorClass="bg-red-500 text-red-500" 
          />
          <StatCard 
            title="New Today" 
            value={`+${todaysJoiners}`} 
            icon={TrendingUp} 
            colorClass="bg-green-500 text-green-500" 
          />
        </div>
      </div>

      {/* --- 2. SEARCH & CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Search Bar */}
        <div className="flex items-center gap-4 bg-[#1a110d] p-4 rounded-xl border border-[#3e2723]">
          <div className="flex-1">
            <SearchUsers />
          </div>
          {query && (
            <div className="hidden md:block text-sm text-[#a1887f] font-mono whitespace-nowrap px-4">
              Found {searchedUsers.length} results
            </div>
          )}
        </div>

        {/* DYNAMIC CONTENT SWITCHER */}
        {query ? (
          // === MODE A: SEARCH RESULTS (Your existing grid) ===
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#eaddcf] flex items-center gap-2">
              <Search size={20} className="text-[#d4af37]" />
              Search Results
            </h2>
            
            {searchedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#3e2723] rounded-2xl bg-[#1a110d]/30">
                <div className="bg-[#3e2723]/20 p-6 rounded-full mb-4">
                  <User className="h-12 w-12 text-[#5d4037]" />
                </div>
                <h3 className="text-xl font-bold text-[#a1887f]">No Disciples Found</h3>
                <p className="text-[#5d4037] text-sm mt-2">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchedUsers.map((user) => {
                  const currentRole = (user.publicMetadata.role as string) || "user";
                  const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
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
        ) : (
          // === MODE B: ACTIVITY DASHBOARD (Default view) ===
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Activity Chart & Feed */}
            <div className="lg:col-span-2 space-y-8">
              <ActivityChart chartData={chartData} />

              <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#eaddcf] flex items-center gap-2">
                    <Activity size={18} className="text-[#d4af37]" />
                    Recent Movements
                  </h2>
                  <Link href="/admin/users" className="text-xs text-[#d4af37] hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="flex flex-col">
                  {recentUsers.map((u) => (
                    <ActivityItem 
                      key={u.id}
                      icon={UserPlus}
                      text={`${u.firstName} ${u.lastName || ""} joined the dojo`}
                      time={formatDistanceToNow(new Date(u.createdAt!)) + " ago"}
                      color="bg-blue-500 text-blue-500"
                    />
                  ))}
                  {recentUsers.length === 0 && <p className="text-[#5d4037] italic text-sm">No recent activity.</p>}
                </div>
              </div>
            </div>

            {/* RIGHT: Quick Actions */}
            <div className="space-y-6">
              <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] p-6">
                <h2 className="text-lg font-bold text-[#eaddcf] mb-4">Admin Actions</h2>
                <div className="space-y-3">
                  <Link href="/admin/users" className="block w-full">
                    <div className="flex items-center gap-3 rounded-lg border border-[#3e2723] bg-[#0f0b0a] p-3 hover:bg-[#3e2723]/40 hover:border-blue-500/50 transition-all group">
                       <ShieldCheck size={18} className="text-[#a1887f] group-hover:text-blue-500" />
                       <span className="text-sm text-[#eaddcf]">Manage Roles</span>
                    </div>
                  </Link>
                  <Link href="/admin/reports" className="block w-full">
                    <div className="flex items-center gap-3 rounded-lg border border-[#3e2723] bg-[#0f0b0a] p-3 hover:bg-[#3e2723]/40 hover:border-red-500/50 transition-all group">
                       <ShieldAlert size={18} className="text-[#a1887f] group-hover:text-red-500" />
                       <span className="text-sm text-[#eaddcf]">The Tribunal</span>
                    </div>
                  </Link>
                  <Link href="/admin/settings" className="block w-full">
                    <div className="flex items-center gap-3 rounded-lg border border-[#3e2723] bg-[#0f0b0a] p-3 hover:bg-[#3e2723]/40 hover:border-[#d4af37]/50 transition-all group">
                       <Settings size={18} className="text-[#a1887f] group-hover:text-[#d4af37]" />
                       <span className="text-sm text-[#eaddcf]">System Settings</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* System Status Badge */}
              <div className="p-4 rounded-xl border border-green-900/30 bg-green-900/10 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest">System Online</p>
                  <p className="text-[10px] text-green-500/70">Database & Auth services operational</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}