"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CompanyCarousel, CompanyCardItem } from "./CompanyCarousel"; // Check path

// 1. Update Interface to accept userProgress
interface Props {
  initialData: CompanyCardItem[];
  userProgress: Record<string, string>; // <--- ADD THIS
}

export function CompanySection({ initialData, userProgress }: Props) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyCardItem[]>(initialData);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Revert to initial data if search is empty
    if (!query.trim()) {
      setCompanies(initialData);
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/companies?company=${query}`);
        if (res.ok) {
          const data = await res.json();
          setCompanies(Array.isArray(data) ? data : []);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Search failed", error);
        setCompanies([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, initialData]);

  return (
    <div className="space-y-6">
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="relative w-full max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d4037]">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <Input 
            placeholder="Search for a company (e.g. Google)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-[#1a110d] border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus-visible:ring-[#d4af37]/50 h-10 transition-all focus:bg-[#1a110d]/80"
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="min-h-[250px]">
        {companies.length > 0 ? (
          <CompanyCarousel 
            items={companies} 
            userProgress={userProgress} // <--- CRITICAL FIX: Pass the prop down
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 w-full border border-dashed border-[#3e2723] rounded-2xl bg-[#1a110d]/30 text-center">
            <p className="text-[#eaddcf] font-medium">No companies found</p>
            <p className="text-[#5d4037] text-sm mt-1">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
}