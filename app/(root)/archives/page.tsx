import Link from "next/link";
import { BookMarked, Library, ArrowRight, ScrollText, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookmarksHub() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:py-12 space-y-8">
      <div className="space-y-2 text-center mb-10">
        <h1 className="text-4xl font-black text-[#d4af37] tracking-tight">
          The Archives
        </h1>
        <p className="text-[#a1887f]">
          Select a collection to view your saved techniques and scrolls.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: The Shelf (Questions) */}
        <Link href="/archives/shelf" className="group">
          <div className="h-full rounded-2xl border border-[#3e2723] bg-[#1a110d] p-8 transition-all duration-300 hover:border-[#d4af37] hover:bg-[#3e2723]/10 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] relative overflow-hidden">
            {/* Background Icon Decoration */}
            <Swords className="absolute -bottom-8 -right-8 w-48 h-48 text-[#3e2723]/20 group-hover:text-[#d4af37]/5 transition-colors" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="bg-[#3e2723]/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-colors">
                <Library className="w-6 h-6 text-[#d4af37] group-hover:text-[#0f0b0a]" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#eaddcf] mb-2 group-hover:text-[#d4af37] transition-colors">
                The Shelf
              </h2>
              <p className="text-[#a1887f] mb-8 leading-relaxed">
                Your personal library of coding katas. Revisit stuck problems, 
                practice important patterns, and review saved challenges.
              </p>

              <div className="mt-auto flex items-center text-sm font-bold text-[#d4af37] gap-2">
                Open Shelf <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Community Bookmarks (Discussions) */}
        <Link href="/archives/bookmarks  " className="group">
          <div className="h-full rounded-2xl border border-[#3e2723] bg-[#1a110d] p-8 transition-all duration-300 hover:border-[#d4af37] hover:bg-[#3e2723]/10 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] relative overflow-hidden">
             {/* Background Icon Decoration */}
             <ScrollText className="absolute -bottom-8 -right-8 w-48 h-48 text-[#3e2723]/20 group-hover:text-[#d4af37]/5 transition-colors" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="bg-[#3e2723]/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-colors">
                <BookMarked className="w-6 h-6 text-[#d4af37] group-hover:text-[#0f0b0a]" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#eaddcf] mb-2 group-hover:text-[#d4af37] transition-colors">
                Saved Scrolls
              </h2>
              <p className="text-[#a1887f] mb-8 leading-relaxed">
                Bookmarked discussions and wisdom from the community. 
                Keep track of insightful threads and valuable comments.
              </p>

              <div className="mt-auto flex items-center text-sm font-bold text-[#d4af37] gap-2">
                View Bookmarks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}