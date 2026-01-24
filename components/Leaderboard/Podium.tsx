"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BELTS } from "@/constants/belts";

interface PodiumUser {
  id: string;
  name: string;
  profileUrl: string | null;
  beltRank: string; // Add Belt Rank
  stats: {
    reputation: number;
    companies: number;
    questions: number;
  };
}

export function Podium({ users, type }: { users: PodiumUser[]; type: string }) {
  // Sort for display logic: 2nd, 1st, 3rd
  const first = users[0];
  const second = users[1];
  const third = users[2];

  const getScore = (u: PodiumUser) => {
    if (type === "companies") return u.stats.companies;
    if (type === "questions") return u.stats.questions;
    return u.stats.reputation;
  };

  return (
    <div className="flex justify-center items-end gap-2 md:gap-6 pt-10 pb-8 min-h-[350px]">
      <PodiumStep user={second} rank={2} score={second ? getScore(second) : 0} delay={0.2} />
      <PodiumStep user={first} rank={1} score={first ? getScore(first) : 0} delay={0} />
      <PodiumStep user={third} rank={3} score={third ? getScore(third) : 0} delay={0.4} />
    </div>
  );
}

function PodiumStep({
  user,
  rank,
  score,
  delay,
}: {
  user?: PodiumUser;
  rank: number;
  score: number;
  delay: number;
}) {
  if (!user) return <div className="w-24 md:w-32 h-10" />;

  const isFirst = rank === 1;
  const heightClass = isFirst ? "h-40 md:h-52" : rank === 2 ? "h-28 md:h-36" : "h-20 md:h-24";
  const borderColor = isFirst
    ? "border-[#d4af37]"
    : rank === 2
      ? "border-slate-400"
      : "border-[#8d6e63]";

  // Find Belt Color
  const beltInfo =
    BELTS.find((b) => b.name.toLowerCase().replace(" ", "_") === user.beltRank) || BELTS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      className="flex flex-col items-center group relative z-10"
    >
      {isFirst && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-2"
        >
          <Crown className="w-8 h-8 md:w-12 md:h-12 text-[#d4af37] fill-[#d4af37]/20 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
        </motion.div>
      )}

      {/* Avatar */}
      <div className="relative mb-3 md:mb-4">
        <Link href={`/member/${user.name}`}>
          <div
            className={cn(
              "relative rounded-full border-4 overflow-hidden bg-[#0f0b0a] transition-transform duration-300 group-hover:scale-110",
              isFirst ? "w-24 h-24 md:w-32 md:h-32" : "w-16 h-16 md:w-20 md:h-20",
              borderColor,
              isFirst ? "shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)]" : "shadow-lg"
            )}
          >
            {user.profileUrl ? (
              <Image src={user.profileUrl} alt={user.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1a110d] flex items-center justify-center">
                <Hexagon className="text-[#5d4037]" />
              </div>
            )}
          </div>
          {/* Belt Badge */}
          <div
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full shadow-sm",
              beltInfo.color
            )}
          />
        </Link>
      </div>

      <div className="text-center mb-2">
        <h3
          className={cn(
            "font-bold text-[#eaddcf] truncate max-w-[100px] md:max-w-[150px]",
            isFirst ? "text-lg md:text-xl" : "text-sm md:text-base"
          )}
        >
          {user.name}
        </h3>
        <p className="text-[#d4af37] font-mono font-bold">{score.toLocaleString()}</p>
      </div>

      {/* Pedestal with Gradient */}
      <div
        className={cn(
          "w-24 md:w-40 bg-linear-to-t from-[#1a110d] to-[#2d211e] rounded-t-lg border-x border-t relative flex items-start justify-center pt-4 shadow-2xl",
          heightClass,
          borderColor
        )}
      >
        <span
          className={cn(
            "text-4xl md:text-6xl font-black text-white/5 select-none",
            isFirst ? "text-yellow-500/10" : ""
          )}
        >
          {rank}
        </span>
      </div>
    </motion.div>
  );
}
