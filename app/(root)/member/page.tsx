"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, User, ExternalLink, Cat, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import DojoBg from "@/public/dojobg.png";

// Types
interface SearchUser {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  profileUrl: string | null;
  email: string;
}

export default function MemberSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced API Call
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users?query=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          }
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
          setHasSearched(true);
        }
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // ✅ Clear Handler
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen text-[#eaddcf] pb-20 overflow-x-hidden">
      {/* 1. HEADER & SEARCH AREA */}
      <div className="relative z-20 pt-16 pb-8 px-4 container mx-auto max-w-4xl text-center space-y-8">
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-[#d4af37] tracking-tight uppercase drop-shadow-md">
            The Ronin Registry
          </h1>
          <p className="text-[#a1887f] text-lg">
            Find fellow students, masters, and travelers of the Dojo.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {/* Search Icon (Left) */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-[#5d4037] group-focus-within:text-[#d4af37] transition-colors" />
            )}
          </div>

          <Input
            ref={inputRef}
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-12 bg-[#1a110d]/80 backdrop-blur-md border-[#3e2723] text-lg text-[#eaddcf] placeholder:text-[#5d4037] focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37] rounded-2xl shadow-xl transition-all"
          />

          {/* Clear Button (Right) */}
          {query.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-4 flex items-center text-[#5d4037] hover:text-[#d4af37] transition-colors animate-in fade-in zoom-in duration-200 z-10"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. RESULTS AREA */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl min-h-[400px]">
        {hasSearched ? (
          /* --- STATE A: SEARCH RESULTS --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.length > 0 ? (
              results.map((user) => <UserCard key={user.id} user={user} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                <Cat className="w-12 h-12 mb-4 text-[#5d4037]" />
                <p className="text-[#a1887f]">No ronin found hiding in the shadows.</p>
              </div>
            )}
          </div>
        ) : (
          /* --- STATE B: DOJO FRAMED IMAGE (Empty State) --- */
          <DojoGroundsBackground />
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: USER CARD ---
function UserCard({ user }: { user: SearchUser }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Ninja";

  return (
    <Link href={`/member/${user.name}`} className="block group relative">
      <Card className="relative overflow-hidden bg-linear-to-br from-[#1a110d] to-[#0f0b0a] border-[#3e2723] p-4 flex items-center gap-5 transition-all duration-500 group-hover:border-[#d4af37]/80 group-hover:-translate-y-1 group-hover:shadow-[0_8px_25px_-10px_rgba(212,175,55,0.3)]">
        {/* Subtle Golden Glow on Hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full border-[3px] border-[#2a1d18] group-hover:border-[#d4af37] transition-colors duration-500 shrink-0 shadow-sm overflow-hidden z-10">
          {user.profileUrl ? (
            <Image src={user.profileUrl} alt={fullName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[#0f0b0a] flex items-center justify-center">
              <User className="w-8 h-8 text-[#5d4037]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center z-10">
          <h3 className="text-lg font-black text-[#eaddcf] truncate group-hover:text-[#d4af37] transition-colors tracking-tight leading-tight">
            {fullName}
          </h3>
          <p className="text-sm text-[#a1887f] font-mono truncate opacity-80 group-hover:opacity-100 transition-opacity">
            @{user.name}
          </p>
        </div>

        {/* Action Icon */}
        <div className="h-10 w-10 rounded-full bg-[#0f0b0a] border border-[#3e2723] flex items-center justify-center text-[#5d4037] group-hover:text-[#d4af37] group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/10 transition-all duration-300 z-10 shrink-0">
          <ExternalLink className="w-5 h-5" />
        </div>
      </Card>
    </Link>
  );
}

// --- SUB-COMPONENT: WOODEN FRAME BACKGROUND ---
function DojoGroundsBackground() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-8 pb-20 space-y-8 animate-in fade-in zoom-in duration-1000">
      {/* THE WOODEN FRAME */}
      {/* Outer dark wood rim */}
      <div className="relative w-full max-w-4xl aspect-video rounded-lg bg-[#271c19] p-3 shadow-2xl border-4 border-[#1a110d] ring-1 ring-[#3e2723]/50">
        {/* Inner lighter wood bezel */}
        <div className="relative w-full h-full bg-[#3e2723] p-2 rounded border-2 border-[#5d4037] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          {/* The Image Container */}
          <div className="relative w-full h-full overflow-hidden rounded shadow-inner bg-black">
            <Image
              src={DojoBg}
              alt="Dojo Grounds"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-[20s] ease-linear"
            />

            {/* Subtle sheen overlay for glass effect */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Decorative Corner Bolts (CSS simulation) */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#1a110d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-[#3e2723]" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#1a110d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-[#3e2723]" />
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#1a110d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-[#3e2723]" />
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#1a110d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-[#3e2723]" />

        {/* Floating elements sitting ON the frame */}
        <div className="absolute -bottom-3 -right-3 z-20 animate-bounce duration-4000">
          <Cat className="w-10 h-10 text-[#d4af37] drop-shadow-lg rotate-12" />
        </div>
      </div>

      {/* Text Caption */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-[#eaddcf] italic opacity-90 drop-shadow-md flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          "The dojo is peaceful..."
        </h3>
        <p className="text-[#a1887f] text-sm font-medium">
          Type above to summon a ronin from the archives.
        </p>
      </div>
    </div>
  );
}
