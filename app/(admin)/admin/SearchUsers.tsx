"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const queryTerm = formData.get("search") as string;
    
    // Construct new URL parameters
    const params = new URLSearchParams(searchParams);
    if (queryTerm) {
      params.set("search", queryTerm);
    } else {
      params.delete("search");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Search Icon (Absolute positioned inside input) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d4037] group-focus-within:text-[#d4af37] transition-colors duration-300">
          <Search size={18} />
        </div>

        <Input
          id="search"
          name="search"
          type="text"
          placeholder="Search for users..."
          defaultValue={searchParams.get("search")?.toString()}
          className="
            h-10 w-full pl-10 pr-20
            bg-[#1a110d] 
            border border-[#3e2723] 
            text-[#eaddcf] 
            placeholder:text-[#5d4037] 
            rounded-full 
            focus-visible:ring-1 focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37]
            transition-all duration-300
          "
        />

        {/* Submit Button (Inside the input on the right) */}
        <Button 
          type="submit" 
          size="sm"
          className="
            absolute right-1 top-1/2 -translate-y-1/2 
            h-8 rounded-full 
            bg-[#3e2723] text-[#a1887f] 
            hover:bg-[#d4af37] hover:text-[#1a110d] 
            font-bold text-xs tracking-wide
            transition-colors duration-300
          "
        >
          Search
        </Button>

      </form>
    </div>
  );
};