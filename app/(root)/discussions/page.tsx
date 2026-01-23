"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, ArrowUpDown, Loader2, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiscussionPagination from "@/components/Discussion/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import SearchDiscussion from "@/components/Discussion/SearchDiscussion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DiscussionSkeleton } from "@/components/Discussion/DiscussionSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import DiscussionPreviewCard from "@/components/Discussion/DiscussionPreview";
import { fetchItems } from "@/lib/actions/caching";

export default function DiscussionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSort = searchParams.get("sort") || "top";

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/discussions?${searchParams.toString()}`);
        console.log(Date.now());
        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();
        setDiscussions(result.data);
        setTotalPage(result.meta.totalPages);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setIsFetching(false);
        setIsInitialLoading(false);
      }
    };
    fetchItems({key: "discussions", fetcher: fetchDiscussions, expires: 60 * 60});
  }, [searchParams]);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/discussions?${params.toString()}`);
  };

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

        <div className="flex flex-col sm:flex-row gap-2 mb-8 w-full justify-center">
          <SearchDiscussion inputValue={inputValue} setInputValue={setInputValue} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 px-4 gap-2 border-[#3e2723] bg-[#1a110d]/50 text-[#a1887f] hover:bg-[#1a110d] hover:text-[#d4af37] hover:border-[#d4af37] rounded-xl transition-all min-w-[140px] justify-between shrink-0"
              >
                <span className="text-xs uppercase tracking-wider font-bold">
                  {currentSort === "top" && "Top Rated"}
                  {currentSort === "latest" && "Latest"}
                  {currentSort === "oldest" && "Oldest"}
                  {currentSort === "controversial" && "Controversial"}
                </span>
                <ArrowUpDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
            >
              <DropdownMenuLabel className="text-xs text-[#5d4037] uppercase tracking-widest">
                Sort Scrolls
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#3e2723]" />

              <DropdownMenuItem
                onClick={() => handleSortChange("top")}
                className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37]"
              >
                Top Rated
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("latest")}
                className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37]"
              >
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("oldest")}
                className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37]"
              >
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("controversial")}
                className="cursor-pointer focus:bg-[#d4af37]/10 focus:text-[#d4af37]"
              >
                Controversial
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="h-12 px-4 gap-2 border-[#3e2723] bg-[#1a110d]/50 text-[#a1887f] hover:bg-[#1a110d] hover:text-[#d4af37] hover:border-[#d4af37] rounded-xl transition-all min-w-[140px] justify-between shrink-0"
            onClick={() => setInputValue("")}
          >
            <FilterIcon size={16} />
            Remove Filters
          </Button>
        </div>
        <div className="space-y-4">
          {isInitialLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <DiscussionSkeleton key={i} />
              ))}
            </div>
          ) : discussions.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + currentSort}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`space-y-4 ${isFetching ? "opacity-50 pointer-events-none grayscale-[0.5]" : ""}`}
              >
                {discussions.map((disc) => (
                  <DiscussionPreviewCard key={disc.id} data={disc} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#3e2723] rounded-xl">
              <p className="text-[#d4af37] font-bold text-lg">No discussions found</p>
              <p className="text-[#a1887f] text-sm mt-1">Be the first to break the silence.</p>
              <Button variant="link" onClick={() => setInputValue("")} className="text-[#d4af37]">
                Clear Filters
              </Button>
            </div>
          )}
          {isFetching && !isInitialLoading && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-[#1a110d] border border-[#d4af37] rounded-full p-2 shadow-xl animate-in fade-in zoom-in">
              <Loader2 className="animate-spin h-6 w-6 text-[#d4af37]" />
            </div>
          )}
        </div>
        {!isInitialLoading && (
          <DiscussionPagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", page.toString());
              router.push(`/discussions?${params.toString()}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
