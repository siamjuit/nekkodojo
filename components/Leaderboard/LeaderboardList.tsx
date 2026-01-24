"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BELTS } from "@/constants/belts";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface ListUser {
  id: string;
  name: string;
  profileUrl: string | null;
  beltRank: string;
  stats: {
    reputation: number;
    companies: number;
    questions: number;
  };
}

export function LeaderboardList({
  users,
  type,
  startIndex,
}: {
  users: ListUser[];
  type: string;
  startIndex: number;
}) {
  const getScore = (u: ListUser) => {
    if (type === "companies") return u.stats.companies;
    if (type === "questions") return u.stats.questions;
    return u.stats.reputation;
  };

  const getLabel = () => {
    if (type === "companies") return "Clans Conquered";
    if (type === "questions") return "Katas Solved";
    return "Reputation";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-[#5d4037] uppercase tracking-widest border-b border-[#3e2723]/50 mb-2">
        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
        <div className="col-span-7 md:col-span-6">Ronin</div>
        <div className="hidden md:block col-span-3 text-right">Belt Rank</div>
        <div className="col-span-3 md:col-span-2 text-right">{getLabel()}</div>
      </div>

      {users.map((user, idx) => {
        const rank = startIndex + idx;
        const beltInfo =
          BELTS.find((b) => b.name.toLowerCase().replace(" ", "_") === user.beltRank) || BELTS[0];

        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 + 0.5 }}
          >
            <Link href={`/member/${user.name}`}>
              <div className="group grid grid-cols-12 items-center bg-[#1a110d] hover:bg-[#251814] border border-[#3e2723] hover:border-[#d4af37]/50 rounded-xl p-3 md:p-4 transition-all duration-300">
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 text-center font-mono text-[#5d4037] group-hover:text-[#d4af37] font-bold text-lg">
                  #{rank}
                </div>

                {/* Profile */}
                <div className="col-span-7 md:col-span-6 flex items-center gap-3 md:gap-4">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-[#3e2723] group-hover:border-[#d4af37] shrink-0">
                    {user.profileUrl ? (
                      <Image src={user.profileUrl} alt={user.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#0f0b0a] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#5d4037]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[#eaddcf] font-bold truncate group-hover:text-[#d4af37] transition-colors">
                      {user.name}
                    </h4>
                    {/* Mobile Belt display */}
                    <span
                      className={cn(
                        "md:hidden text-[10px] px-1.5 py-0.5 rounded border mt-1 inline-block",
                        beltInfo.color
                      )}
                    >
                      {beltInfo.name}
                    </span>
                  </div>
                </div>

                {/* Belt (Desktop) */}
                <div className="hidden md:block col-span-3 text-right">
                  <span
                    className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full border border-current opacity-80",
                      beltInfo.color
                    )}
                  >
                    {beltInfo.name}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-3 md:col-span-2 text-right">
                  <span className="font-mono font-bold text-[#eaddcf] text-lg group-hover:text-white group-hover:scale-105 inline-block transition-transform">
                    {getScore(user).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
