"use client";

import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BELTS = [
  { name: "White Belt", minSolved: 0, color: "bg-white text-black" },
  { name: "Yellow Belt", minSolved: 10, color: "bg-yellow-400 text-black" },
  { name: "Orange Belt", minSolved: 25, color: "bg-orange-500 text-white" },
  { name: "Green Belt", minSolved: 50, color: "bg-green-600 text-white" },
  { name: "Blue Belt", minSolved: 100, color: "bg-blue-600 text-white" },
  { name: "Purple Belt", minSolved: 200, color: "bg-purple-600 text-white" },
  { name: "Brown Belt", minSolved: 350, color: "bg-[#6d4c41] text-white" },
  { name: "Black Belt", minSolved: 500, color: "bg-black text-white" },
];

export function BeltProgress({ totalSolved }: { totalSolved: number }) {
  const currentIndex = BELTS.findLastIndex((belt) => totalSolved >= belt.minSolved);

  const current = BELTS[currentIndex];
  const next = BELTS[currentIndex + 1];

  const progress = next
    ? Math.min(
        100,
        Math.round(((totalSolved - current.minSolved) / (next.minSolved - current.minSolved)) * 100)
      )
    : 100;

  return (
    <section className="rounded-3xl border border-amber-500/20 bg-linear-to-br from-[#111111] to-black p-6 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-2">Rank Progression</p>

          <h2 className="text-2xl font-black text-white">Dojo Belts</h2>

          <p className="text-sm text-zinc-400 mt-2">
            Current Rank: <span className="text-amber-400 font-bold">{current.name}</span>
          </p>
        </div>

        {next && (
          <div className="text-sm text-zinc-400">
            Next Rank: <span className="text-white font-semibold">{next.name}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      {next && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest">
            <span>Journey</span>
            <span>{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-zinc-400">
            {totalSolved} solved • Need{" "}
            <span className="text-white font-semibold">{next.minSolved - totalSolved}</span> more
            for {next.name}
          </p>
        </div>
      )}

      {/* Belts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BELTS.map((belt, index) => {
          const unlocked = totalSolved >= belt.minSolved;
          const active = index === currentIndex;

          return (
            <div
              key={belt.name}
              className={cn(
                "rounded-2xl border p-4 transition-all",
                unlocked
                  ? "border-zinc-700 bg-[#0f0f0f]"
                  : "border-zinc-900 bg-[#0a0a0a] opacity-50",
                active && "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              )}
            >
              {/* Belt Bar */}
              <div
                className={cn(
                  "h-8 rounded-xl flex items-center justify-center font-bold text-xs",
                  unlocked ? belt.color : "bg-zinc-800 text-zinc-500"
                )}
              >
                {unlocked ? belt.name : <Lock className="h-4 w-4" />}
              </div>

              <div className="mt-4">
                <p className="font-semibold text-sm text-white">{belt.name}</p>

                <p className="text-xs text-zinc-500 mt-1">{belt.minSolved}+ solved</p>

                {active && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    Active <ChevronRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
