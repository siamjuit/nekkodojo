import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

// --- CONFIGURATION ---
const BELTS = [
  { name: "White Belt", minSolved: 0, color: "bg-white text-black border-gray-200" },
  {
    name: "Yellow Belt",
    minSolved: 10,
    color: "bg-yellow-400 text-black border-yellow-500 shadow-yellow-400/50",
  },
  {
    name: "Orange Belt",
    minSolved: 25,
    color: "bg-orange-500 text-white border-orange-600 shadow-orange-500/50",
  },
  {
    name: "Green Belt",
    minSolved: 50,
    color: "bg-green-600 text-white border-green-700 shadow-green-600/50",
  },
  {
    name: "Blue Belt",
    minSolved: 100,
    color: "bg-blue-600 text-white border-blue-700 shadow-blue-600/50",
  },
  {
    name: "Purple Belt",
    minSolved: 200,
    color: "bg-purple-600 text-white border-purple-700 shadow-purple-600/50",
  },
  {
    name: "Brown Belt",
    minSolved: 350,
    color: "bg-[#795548] text-white border-[#5d4037] shadow-[#795548]/50",
  },
  {
    name: "Black Belt",
    minSolved: 500,
    color: "bg-neutral-900 text-white border-neutral-700 shadow-black/50",
  },
];

export function BeltProgress({ totalSolved }: { totalSolved: number }) {
  // Find current belt (the highest one unlocked)
  const currentBeltIndex = BELTS.findLastIndex((b) => totalSolved >= b.minSolved);
  const nextBelt = BELTS[currentBeltIndex + 1];
  const progressToNext = nextBelt
    ? Math.min(
        100,
        Math.round(
          ((totalSolved - BELTS[currentBeltIndex].minSolved) /
            (nextBelt.minSolved - BELTS[currentBeltIndex].minSolved)) *
            100
        )
      )
    : 100;

  return (
    <div className="space-y-6">
      {/* Header Info - Responsive Stack */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#3e2723] pb-4 gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#eaddcf]">Dojo Ranks</h2>
          <p className="text-[#a1887f] text-xs md:text-sm mt-1">
            Current Rank:{" "}
            <span className="text-[#d4af37] font-bold">{BELTS[currentBeltIndex].name}</span>
          </p>
        </div>
        {nextBelt && (
          <div className="text-left sm:text-right">
            <span className="text-[10px] md:text-xs text-[#5d4037] uppercase font-mono block mb-1">
              Next Milestone
            </span>
            <div className="flex items-center gap-2 sm:justify-end">
              {/* Mobile Progress Bar (Optional Visual Cue) */}
              <div className="h-1.5 w-16 bg-[#1a110d] rounded-full overflow-hidden sm:hidden border border-[#3e2723]">
                <div 
                  className="h-full bg-[#d4af37]" 
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-[#eaddcf] text-xs md:text-sm font-medium">
                {totalSolved} / {nextBelt.minSolved} <span className="text-[#a1887f] ml-1">({progressToNext}%)</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Belts Grid - Responsive Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {BELTS.map((belt, idx) => {
          const isUnlocked = totalSolved >= belt.minSolved;
          const isCurrent = idx === currentBeltIndex;

          return (
            <div
              key={belt.name}
              className={cn(
                "relative flex flex-col items-center p-3 md:p-4 rounded-xl border transition-all duration-500",
                // Unlocked Style
                isUnlocked
                  ? "bg-[#1a110d] border-[#3e2723]"
                  : "bg-[#0f0b0a] border-[#271b16] opacity-60 grayscale", // Locked "Shadow" Look
                // Current Belt Highlight
                isCurrent &&
                  "ring-1 ring-[#d4af37] bg-[#1a110d] shadow-[0_0_20px_rgba(212,175,55,0.1)] scale-[1.02]"
              )}
            >
              {/* Belt Visual Representation */}
              <div
                className={cn(
                  "h-6 md:h-8 w-full rounded mb-2 md:mb-3 flex items-center justify-center relative shadow-lg transition-transform hover:scale-105",
                  isUnlocked ? belt.color : "bg-[#2a201d] border-[#3e2723]", // Dull gray if locked
                  isUnlocked && "shadow-[0_0_15px_currentColor]" // Glow if unlocked
                )}
              >
                {/* The "Knot" of the belt */}
                <div className="w-1 md:w-1.5 h-full bg-black/20 absolute left-6 md:left-8" />

                {/* Lock Icon for locked belts */}
                {!isUnlocked && <Lock className="w-3 h-3 md:w-4 md:h-4 text-[#5d4037]" />}
              </div>

              {/* Text Info */}
              <div className="text-center space-y-0.5 md:space-y-1">
                <span
                  className={cn(
                    "block font-bold text-xs md:text-sm truncate px-1",
                    isUnlocked ? "text-[#eaddcf]" : "text-[#5d4037]"
                  )}
                >
                  {belt.name}
                </span>
                <span className="block text-[10px] font-mono text-[#a1887f]">
                  {belt.minSolved}+ Solved
                </span>
              </div>

              {/* Locked Overlay (Optional visual effect) */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-[#0f0b0a]/40 z-10 pointer-events-none rounded-xl" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}