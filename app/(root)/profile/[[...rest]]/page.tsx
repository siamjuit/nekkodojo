import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Trophy, Flame, Target } from "lucide-react";
import { DojoProgress } from "@/components/ui/dojo-progress"; // Use the component we made earlier

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  // 1. FETCH RAW DATA (Parallel for speed)
  const [userProgressData, allCategories, allCompanies] = await Promise.all([
    // A. Get all solved question IDs for this user
    prisma.userProgress.findMany({
      where: { userId: user.id, status: "completed" },
      select: { questionId: true },
    }),
    
    // B. Get all Categories with question IDs (to calculate totals)
    prisma.category.findMany({
      include: { questions: { select: { id: true } } },
    }),

    // C. Get all Companies with question IDs
    prisma.company.findMany({
      include: { questions: { select: { id: true } } },
    }),
  ]);

  // 2. OPTIMIZE LOOKUP (O(1) Speed)
  // Convert the array of solved objects to a Set of IDs for instant checking
  const solvedSet = new Set(userProgressData.map((p) => p.questionId));
  const totalSolved = solvedSet.size;

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        
        {/* --- HEADER STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={Trophy} 
            label="Total Solved" 
            value={totalSolved} 
            sub="Katas Mastered"
            color="text-yellow-500"
          />
          {/* You can calculate streaks here if you have timestamps */}
          <StatCard 
            icon={Flame} 
            label="Current Streak" 
            value={0} 
            sub="Days Active"
            color="text-orange-500"
          />
          <StatCard 
            icon={Target} 
            label="Global Rank" 
            value="Novice" 
            sub="Keep Training"
            color="text-green-500"
          />
        </div>

        {/* --- CATEGORY BREAKDOWN --- */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#eaddcf] border-b border-[#3e2723] pb-4">
            Skill Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCategories.map((cat) => {
              // CALCULATION HAPPENS HERE
              const total = cat.questions.length;
              if (total === 0) return null; // Hide empty categories

              const solvedCount = cat.questions.filter((q) => solvedSet.has(q.id)).length;
              const percent = Math.round((solvedCount / total) * 100);

              return (
                <div key={cat.id} className="bg-[#1a110d] border border-[#3e2723] p-5 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-[#eaddcf]">{cat.name}</span>
                    <span className="text-xs font-mono text-[#a1887f]">
                      {solvedCount}/{total} ({percent}%)
                    </span>
                  </div>
                  <DojoProgress value={percent} />
                </div>
              );
            })}
          </div>
        </section>

        {/* --- COMPANY MASTERY --- */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#eaddcf] border-b border-[#3e2723] pb-4">
            Company Mastery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allCompanies.map((comp) => {
              // CALCULATION HAPPENS HERE
              const total = comp.questions.length;
              if (total === 0) return null;

              const solvedCount = comp.questions.filter((q) => solvedSet.has(q.id)).length;
              const percent = Math.round((solvedCount / total) * 100);

              // Only show companies where user has at least started working
              if (solvedCount === 0) return null; 

              return (
                <div key={comp.id} className="bg-[#1a110d] border border-[#3e2723] p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#eaddcf]">{comp.name}</span>
                    <span className="text-[10px] bg-[#3e2723] px-2 py-0.5 rounded-full text-[#d4af37]">
                      {percent}%
                    </span>
                  </div>
                  <DojoProgress value={percent} className="h-1" />
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

// Simple Helper Component
function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="bg-[#1a110d] border border-[#3e2723] p-6 rounded-2xl flex items-center gap-5">
      <div className={`p-4 rounded-full bg-[#0f0b0a] border border-[#3e2723] ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-3xl font-black text-[#eaddcf]">{value}</h3>
        <p className="text-sm font-bold text-[#d4af37]">{label}</p>
        <p className="text-xs text-[#5d4037]">{sub}</p>
      </div>
    </div>
  );
}