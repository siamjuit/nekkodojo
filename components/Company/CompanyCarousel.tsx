"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DojoProgress } from "@/components/ui/dojo-progress"; // Ensure this path is correct

// Updated Interface: We need the list of questions (IDs) to calculate progress
export interface CompanyCardItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  websiteUrl?: string | null;
  _count: {
    questions: number;
  };
  questions: { id: string }[]; // Minimal data needed for calculation
}

interface Props {
  items: CompanyCardItem[];
  userProgress: Record<string, string>; // Maps QuestionID -> Status
}

export function CompanyCarousel({ items, userProgress }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 340; // Card width + gap
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Header Row --- */}
      <div className="flex items-end justify-between px-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[#d4af37] uppercase tracking-widest text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>Top Companies</span>
          </div>
          <h2 className="text-2xl font-bold text-[#eaddcf]">Practice by Company</h2>
        </div>

        {/* Styled Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-[#3e2723] bg-[#1a110d] flex items-center justify-center text-[#a1887f] hover:text-[#d4af37] hover:border-[#d4af37] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-[#3e2723] bg-[#1a110d] flex items-center justify-center text-[#a1887f] hover:text-[#d4af37] hover:border-[#d4af37] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Scroll Container --- */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-8 pt-2 px-1 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((company) => (
          <CompanyCard 
            key={company.id} 
            company={company} 
            userProgress={userProgress} // Pass progress down
          />
        ))}
      </div>
    </div>
  );
}

// --- THE REVAMPED CARD COMPONENT ---
function CompanyCard({
  company,
  userProgress,
}: {
  company: CompanyCardItem;
  userProgress: Record<string, string>;
}) {
  const totalQuestions = company._count.questions;
  const solvedCount =
    company.questions?.filter((q) => userProgress[q.id] === "completed").length || 0;

  const percent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  return (
    <div className="relative w-[320px] h-[220px] shrink-0 rounded-2xl overflow-hidden border border-[#3e2723] bg-[#1a110d] group snap-start transition-all hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/5 flex flex-col">
      {/* Background Glow */}
      {company.logo && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src={company.logo}
            alt="glow"
            fill
            className="object-cover blur-3xl scale-150 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#1a110d]/90 via-[#1a110d]/80 to-[#1a110d]/40" />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-[#eaddcf] leading-tight group-hover:text-white transition-colors">
              {company.name}
            </h3>
            <p className="text-xs font-mono text-[#d4af37] mt-1 flex items-center gap-1">
              {company._count.questions} Problems
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-[#0f0b0a]/80 backdrop-blur-sm border border-[#3e2723] p-2 shadow-sm group-hover:border-[#d4af37]/30 transition-colors">
            {company.logo ? (
              <div className="relative w-full h-full">
                <Image src={company.logo} alt={company.name} fill className="object-contain" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#5d4037] font-bold text-lg">
                {company.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Progress Bar */}
        <div className="mt-auto mb-4 space-y-1.5">
           <div className="flex justify-between items-end">
             <span className="text-[10px] text-[#a1887f] font-mono uppercase tracking-wider">Progress</span>
             <span className={cn("text-xs font-bold", percent === 100 ? "text-green-500" : "text-[#eaddcf]")}>
                {percent}%
             </span>
           </div>
           <DojoProgress value={percent} className="h-1.5" />
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex gap-3">
          <Link href={`/problems/${company.slug}`} className="flex-1">
            <Button className="w-full bg-[#eaddcf] text-[#1a110d] hover:bg-white hover:scale-[1.02] transition-all font-semibold h-8 text-xs">
              Open Sheet <ArrowRight className="w-3 h-3 ml-1.5" />
            </Button>
          </Link>

          {company.websiteUrl ? (
            <Link href={company.websiteUrl} target="_blank">
              <Button
                variant="outline"
                className="w-8 h-8 p-0 rounded-lg border-[#3e2723] bg-[#0f0b0a]/50 text-[#a1887f] hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#1a110d]"
                title="Visit Company Website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-8 h-8 p-0 rounded-lg border-[#3e2723] bg-transparent opacity-50 cursor-not-allowed"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}