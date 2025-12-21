"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Loader2, Search, Filter } from "lucide-react";
import DiscussionPreviewCard from "@/components/Discussion/DiscussionPreview"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";

type SortOption = "latest" | "top" | "controversial" | "oldest";

export default function ForumPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<SortOption>("top");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("sort", sortBy);
        if (searchQuery) params.set("query", searchQuery);

        const response = await fetch(`/api/discussions?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => {
      fetchDiscussions();
    }, 300);

    return () => clearTimeout(timer);
  }, [sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f0b0a] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3e2723] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#eaddcf]">The Dojo Forum</h1>
            <p className="text-[#a1887f] text-sm mt-1">
              Discuss algorithms, share wins, and seek guidance.
            </p>
          </div>

          <Link
            href="/discussions/create"
            className="bg-[#d4af37] hover:bg-[#b5952f] text-[#1a110d] font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <PlusCircle size={20} />
            <span>New Discussion</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-24 z-30 bg-[#0f0b0a]/95 backdrop-blur py-2">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d4037]" size={18} />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a110d] border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:border-[#d4af37] h-11"
            />
          </div>
          <div className="flex items-center bg-[#1a110d] p-1 rounded-lg border border-[#3e2723] overflow-x-auto w-full sm:w-auto gap-1">
            {(["top", "latest", "controversial", "oldest"] as SortOption[]).map((option) => (
              <Button
                suppressHydrationWarning
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                        ${
                          sortBy === option
                            ? "bg-[#d4af37] text-[#1a110d] shadow-sm"
                            : "text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/30"
                        }
                    `}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-4 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="size-10 text-[#d4af37] animate-spin" />
              <p className="text-[#a1887f] animate-pulse">Consulting the archives...</p>
            </div>
          ) : discussions.length > 0 ? (
            discussions.map((discussion) => (
              <DiscussionPreviewCard key={discussion.id} data={discussion} />
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-[#3e2723] rounded-xl">
              <p className="text-[#d4af37] font-bold text-lg">No discussions found</p>
              <p className="text-[#a1887f] text-sm mt-1">Be the first to break the silence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
