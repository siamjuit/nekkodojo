"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHELF_BUTTONS, SHELF_TABS } from "@/constants/shelfs"; 

// Types
type ShelfType = "later" | "revisit" | "important" | "stuck";

interface ShelfItem {
  id: string; 
  type: ShelfType;
  question: {
    id: string; 
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    slug: string;
  };
  createdAt: string;
}

export default function ShelfPage() {
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to remove or move an item from the list *after* API success
  const updateLocalState = (questionId: string, newType: ShelfType | null) => {
    if (newType === null) {
      // Remove item
      setItems((prev) => prev.filter((i) => i.question.id !== questionId));
    } else {
      // Move item to new tab
      setItems((prev) =>
        prev.map((i) => (i.question.id === questionId ? { ...i, type: newType } : i))
      );
    }
  };

  useEffect(() => {
    const fetchShelf = async () => {
      try {
        const response = await fetch("/api/shelf");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        // Normalize type
        const normalizedData = data.map((d: any) => ({
           ...d,
           type: d.type.toLowerCase()
        }))
        setItems(normalizedData);
      } catch (error) {
        toast.error("Could not load shelf items");
      } finally {
        setLoading(false);
      }
    };
    fetchShelf();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-[#d4af37]" size={40} />
      </div>
    );
  }

  const getItemsByType = (type: ShelfType) => items.filter((i) => i.type === type);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/archives" className="p-2 rounded-full hover:bg-[#3e2723]/20 transition-colors">
          <ChevronLeft className="text-[#a1887f]" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#d4af37] tracking-tight">The Shelf</h1>
          <p className="text-[#a1887f] text-sm">Your roadmap of coding problems.</p>
        </div>
      </div>

      <Tabs defaultValue="revisit" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 bg-transparent p-0 mb-6">
          {SHELF_TABS.map((tab) => {
            const count = getItemsByType(tab.value as ShelfType).length;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "data-[state=active]:bg-[#3e2723] data-[state=active]:text-[#eaddcf] border border-[#3e2723] bg-[#1a110d] text-[#a1887f] px-4 py-2 h-10 rounded-full flex items-center gap-2 transition-all hover:border-[#d4af37]/50"
                )}
              >
                <tab.icon className={cn("w-4 h-4", tab.color)} />
                {tab.label}
                <span className="ml-1 text-xs bg-[#0f0b0a] px-2 py-0.5 rounded-full text-[#a1887f]">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SHELF_TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="space-y-3 animate-in fade-in zoom-in-95 duration-300"
          >
            {getItemsByType(tab.value as ShelfType).length > 0 ? (
              getItemsByType(tab.value as ShelfType).map((item) => (
                <ShelfCard 
                  key={item.id} 
                  item={item} 
                  onUpdate={updateLocalState}
                />
              ))
            ) : (
              <EmptyShelf label={tab.label} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// --- CARD SUB-COMPONENT ---
function ShelfCard({ 
  item, 
  onUpdate 
}: { 
  item: ShelfItem; 
  onUpdate: (qId: string, type: ShelfType | null) => void 
}) {
  const { question } = item;
  const [loadingType, setLoadingType] = useState<ShelfType | null>(null);

  if (!question) return null;

  const diffColor =
    question.difficulty === "Easy"
      ? "text-green-400 bg-green-900/20 border-green-900"
      : question.difficulty === "Medium"
      ? "text-yellow-400 bg-yellow-900/20 border-yellow-900"
      : "text-red-400 bg-red-900/20 border-red-900";

  const toggleShelf = async (type: ShelfType) => {
    // 1. Set Loading State
    setLoadingType(type);

    // 2. Determine new action (Move or Remove)
    const newType = item.type === type ? null : type;

    try {
      const res = await fetch(`/api/shelf?questionId=${question.id}&type=${type}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed");
      
      const msg = newType ? `Moved to ${type}` : "Removed from Shelf";
      toast.success(msg);

      // 3. Update State AFTER success
      onUpdate(question.id, newType);

    } catch (error) {
      toast.error("Failed to update shelf");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#3e2723] bg-[#1a110d] hover:border-[#d4af37]/50 transition-all gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-[#eaddcf] text-lg group-hover:text-[#d4af37] transition-colors">
            {question.title}
          </h3>
          <Badge variant="outline" className={cn("border text-[10px] h-5", diffColor)}>
            {question.difficulty}
          </Badge>
        </div>
        <p className="text-xs text-[#a1887f]">
          Shelved on {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        {/* SHELF BUTTONS */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full border border-[#3e2723] bg-[#0f0b0a] shadow-inner">
          <TooltipProvider delayDuration={100}>
            {SHELF_BUTTONS.map((btn) => {
              const isActive = item.type === btn.type;
              const isLoading = loadingType === btn.type;

              return (
                <Tooltip key={btn.type}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleShelf(btn.type as ShelfType)}
                      disabled={loadingType !== null}
                      className={cn(
                        "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        "border border-transparent",
                        isActive
                          ? `${btn.activeColor} shadow-[0_0_12px_-3px_currentColor] scale-110 z-10`
                          : `text-[#5d4037] hover:bg-[#3e2723]/40 ${btn.hoverColor} hover:scale-105`,
                         isLoading && "opacity-50 cursor-wait"
                      )}
                    >
                      {isLoading ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                         <btn.icon
                           className={cn(
                             "w-4 h-4 transition-all duration-300",
                             isActive && "fill-current"
                           )}
                         />
                      )}
                      {isActive && (
                        <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] text-xs">
                    <p>
                      {isActive ? "Remove from " : "Move to "}
                      <span className="font-bold">{btn.label}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        <div className="h-8 w-px bg-[#3e2723] mx-2 hidden sm:block" />

        <Link
          href={`/problems/${question.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-[#a1887f] hover:text-[#d4af37] transition-colors"
        >
          Solve <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function EmptyShelf({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/30 text-[#5d4037]">
      <p>No questions marked as "{label}" yet.</p>
    </div>
  );
}