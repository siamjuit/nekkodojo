"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Podium } from "@/components/Leaderboard/Podium";
import { LeaderboardList } from "@/components/Leaderboard/LeaderboardList";
import { Trophy, Briefcase, Star, Medal, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const [sortType, setSortType] = useState("reputation");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?sort=${sortType}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (error) {
        toast.error("Could not update leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortType]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-96 bg-linear-to-b from-[#3e2723]/20 to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 pt-12 max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
            <Trophy className="w-3 h-3" />
            Hall of Legends
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-sm uppercase tracking-tight">
            Leaderboard
          </h1>
          <p className="text-[#a1887f] max-w-lg mx-auto">
            The scrolls of the highest ranking ninjas. Fame, glory, and eternal code awaits.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center">
          <Tabs value={sortType} onValueChange={setSortType} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a110d] border border-[#3e2723] p-1 h-12">
              <TabsTrigger
                value="reputation"
                className="h-full data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] font-bold"
              >
                <Star className="w-4 h-4 mr-2" /> Rep
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="h-full data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] font-bold"
              >
                <Medal className="w-4 h-4 mr-2" /> Katas
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="h-full data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] font-bold"
              >
                <Briefcase className="w-4 h-4 mr-2" /> Clans
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-[#d4af37]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-[#a1887f] text-sm animate-pulse">Consulting the archives...</p>
          </div>
        ) : (
          <>
            {/* Podium (Top 3) */}
            <Podium users={top3} type={sortType} />

            {/* The List (4-20) */}
            <LeaderboardList users={rest} type={sortType} startIndex={4} />
          </>
        )}
      </div>
    </div>
  );
}
