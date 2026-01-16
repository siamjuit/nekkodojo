"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Unlock, Lock, Trophy, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SHELF_BUTTONS } from "@/constants/shelfs"; // Import constants

// Types
type QuestionStatus = "unvisited" | "attempted" | "completed";
type ShelfType = "later" | "revisit" | "important" | "stuck";

export interface QuestionItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  externalPlatformUrl: string;
  solutionUrl: string | null;
}

interface Props {
  questions: QuestionItem[];
  companyName: string;
}

export function CompanyQuestionsSheet({ questions, companyName }: Props) {
  const [progress, setProgress] = useState<Record<string, QuestionStatus>>({});

  // --- NEW STATE FOR SHELVING ---
  const [shelfState, setShelfState] = useState<Record<string, ShelfType | null>>({});
  const [loadingShelf, setLoadingShelf] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const syncData = async () => {
      try {
        // 1. Fetch Progress
        const progRes = await fetch("/api/progress");
        if (progRes.ok) {
          const data = await progRes.json();
          const map: Record<string, QuestionStatus> = {};
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              map[item.questionId] = item.status as QuestionStatus;
            });
          }
          setProgress(map);
        }

        // 2. Fetch Shelf Data
        const shelfRes = await fetch("/api/shelf");
        if (shelfRes.ok) {
          const shelfData = await shelfRes.json();
          const shelfMap: Record<string, ShelfType> = {};
          if (Array.isArray(shelfData)) {
            shelfData.forEach((item: any) => {
              // Normalize to lowercase
              shelfMap[item.questionId] = item.type.toLowerCase() as ShelfType;
            });
          }
          setShelfState(shelfMap);
        }
      } catch (error) {
        console.error("Failed to sync data", error);
      }
    };
    syncData();
  }, []);

  const handleAttempt = async (q: QuestionItem) => {
    const currentStatus = progress[q.id] || "unvisited";
    if (currentStatus !== "unvisited") return;

    setProgress((prev) => ({ ...prev, [q.id]: "attempted" }));

    try {
      const res = await fetch(`/api/progress/attempted?questionId=${q.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
    } catch (error) {
      toast.error("Sync failed");
      setProgress((prev) => ({ ...prev, [q.id]: "unvisited" }));
    }
  };

  const toggleSolved = async (qId: string, isChecked: boolean) => {
    const prevStatus = progress[qId];

    setProgress((prev) => ({
      ...prev,
      [qId]: isChecked ? "completed" : "attempted",
    }));

    try {
      const res = await fetch(`/api/progress/status?questionId=${qId}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
    } catch (error) {
      toast.error("Sync failed");
      setProgress((prev) => ({ ...prev, [qId]: prevStatus }));
    }
  };

  // --- NEW SHELF TOGGLE HANDLER ---
  const toggleShelf = async (qId: string, type: ShelfType) => {
    const previousType = shelfState[qId];
    setLoadingShelf((prev) => ({ ...prev, [qId]: true }));

    // Optimistic Update
    const newType = previousType === type ? null : type;
    setShelfState((prev) => ({ ...prev, [qId]: newType }));

    try {
      const res = await fetch(`/api/shelf?questionId=${qId}&type=${type}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed");

      const msg = newType ? `Added to ${type.toUpperCase()}` : `Removed from shelf`;
      toast.success(msg);
    } catch (error) {
      toast.error("Failed to update shelf");
      setShelfState((prev) => ({ ...prev, [qId]: previousType })); // Revert
    } finally {
      setLoadingShelf((prev) => ({ ...prev, [qId]: false }));
    }
  };

  const totalQuestions = questions.length;
  const solvedCount = questions.filter((q) => progress[q.id] === "completed").length;
  const isCompanyCompleted = totalQuestions > 0 && totalQuestions === solvedCount;

  return (
    <div className="w-full space-y-6">
      <div
        className={cn(
          "flex items-center justify-between border-b pb-4 mb-8 transition-colors",
          isCompanyCompleted ? "border-green-900" : "border-[#3e2723]"
        )}
      >
        <h2
          className={cn(
            "text-2xl font-bold flex items-center gap-2",
            isCompanyCompleted ? "text-green-500" : "text-[#eaddcf]"
          )}
        >
          <Trophy
            className={cn(
              "w-6 h-6",
              isCompanyCompleted ? "text-green-500 fill-green-500/20" : "text-[#d4af37]"
            )}
          />
          {companyName} Interview Katas
          {isCompanyCompleted && (
            <span className="ml-2 text-xs border border-green-600 bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Mastered
            </span>
          )}
        </h2>

        <span
          className={cn(
            "font-mono text-sm",
            isCompanyCompleted ? "text-green-400" : "text-[#a1887f]"
          )}
        >
          {solvedCount} / {totalQuestions} Solved
        </span>
      </div>

      <Accordion type="single" collapsible className="space-y-4 pb-2">
        {questions.map((q, idx) => {
          const status = progress[q.id] || "unvisited";
          const isSolved = status === "completed";
          const isAttempted = status === "attempted" || isSolved;

          // Shelf Status
          const activeShelf = shelfState[q.id];
          const isLoadingThisShelf = loadingShelf[q.id];

          const borderClass = isSolved
            ? "border-l-green-600 shadow-[inset_4px_0_0_0_#16a34a]"
            : isAttempted
              ? "border-l-[#d4af37] shadow-[inset_4px_0_0_0_#d4af37]"
              : "border-l-[#3e2723] hover:border-l-[#a1887f]";

          return (
            <AccordionItem
              key={q.id}
              value={q.id}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-[#3e2723] bg-[#1a110d] transition-all duration-300",
                "data-[state=open]:border-[#d4af37]/50 data-[state=open]:shadow-lg data-[state=open]:shadow-[#d4af37]/5",
                borderClass
              )}
            >
              <div className="flex items-center w-full">
                {/* Checkbox Section */}
                <div className="pl-5 py-4 flex items-center justify-center">
                  <Checkbox
                    checked={isSolved}
                    onCheckedChange={(checked) => toggleSolved(q.id, checked as boolean)}
                    disabled={status === "unvisited"}
                    className={cn(
                      "w-5 h-5 border-[#3e2723] data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 transition-all",
                      status === "unvisited" && "opacity-20 cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Trigger Area */}
                <AccordionTrigger className="hover:no-underline py-4 px-5 flex-1">
                  <div className="flex items-center gap-4 w-full">
                    <span className="font-mono text-xs text-[#5d4037] w-6">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "text-base font-semibold text-left transition-colors flex-1",
                        isSolved
                          ? "text-[#a1887f] line-through decoration-[#3e2723]"
                          : "text-[#eaddcf] group-hover:text-[#d4af37]"
                      )}
                    >
                      {q.title}
                    </span>

                    <div className="hidden sm:flex items-center gap-3">
                      {/* --- Small Shelf Indicator in Header (Optional) --- */}
                      {activeShelf && (
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            activeShelf === "important" && "bg-yellow-500",
                            activeShelf === "stuck" && "bg-red-500",
                            activeShelf === "revisit" && "bg-orange-500",
                            activeShelf === "later" && "bg-blue-500"
                          )}
                        />
                      )}

                      {isSolved && (
                        <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">
                          Solved
                        </span>
                      )}
                      {status === "attempted" && (
                        <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">
                          Attempted
                        </span>
                      )}

                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] h-6 border bg-[#0f0b0a] min-w-[70px] justify-center",
                          q.difficulty === "Easy"
                            ? "text-green-400 border-green-900/30"
                            : q.difficulty === "Medium"
                              ? "text-yellow-400 border-yellow-900/30"
                              : "text-red-400 border-red-900/30"
                        )}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
              </div>

              {/* Content Area */}
              <AccordionContent className="border-t border-[#3e2723]/50 bg-[#0f0b0a]/30">
                <div className="px-6 py-6 space-y-6">
                  <div className="relative pl-4 border-l-2 border-[#d4af37]/20">
                    <p className="text-sm text-[#a1887f] leading-relaxed">{q.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex gap-3">
                      <Button
                        asChild
                        onClick={() => handleAttempt(q)}
                        className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold h-10 px-6 shadow-md shadow-[#d4af37]/10"
                      >
                        <Link
                          href={q.externalPlatformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Solve Challenge
                        </Link>
                      </Button>

                      {q.solutionUrl && (
                        <Button
                          asChild={isAttempted}
                          disabled={!isAttempted}
                          variant="outline"
                          className={cn(
                            "h-10 px-5 border-[#3e2723] bg-transparent transition-all",
                            isAttempted
                              ? "text-[#eaddcf] hover:text-[#d4af37] hover:border-[#d4af37]"
                              : "text-[#5d4037] opacity-50"
                          )}
                        >
                          {isAttempted ? (
                            <Link
                              href={q.solutionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Unlock className="w-4 h-4" /> View Scroll
                            </Link>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Lock className="w-4 h-4" /> Scroll Sealed
                            </span>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* --- SHELF BUTTONS SECTION --- */}
                      <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-[10px] text-[#5d4037] font-bold tracking-widest uppercase">
                          Shelf
                        </span>
                        {activeShelf && (
                          <span
                            className={cn(
                              "text-[10px] font-mono",
                              activeShelf === "important" && "text-yellow-500",
                              activeShelf === "later" && "text-blue-400",
                              activeShelf === "stuck" && "text-red-500",
                              activeShelf === "revisit" && "text-orange-400"
                            )}
                          >
                            {activeShelf.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 p-1.5 rounded-full border border-[#3e2723] bg-[#0f0b0a] shadow-inner">
                        {isLoadingThisShelf ? (
                          <Loader2 className="w-4 h-4 text-[#a1887f] animate-spin mx-6" />
                        ) : (
                          <TooltipProvider delayDuration={100}>
                            {SHELF_BUTTONS.map((btn) => {
                              const isActive = activeShelf === btn.type;

                              return (
                                <Tooltip key={btn.type}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => toggleShelf(q.id, btn.type)}
                                      className={cn(
                                        "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                        "border border-transparent",
                                        isActive
                                          ? `${btn.activeColor} shadow-[0_0_12px_-3px_currentColor] scale-110 z-10`
                                          : `text-[#5d4037] hover:bg-[#3e2723]/40 ${btn.hoverColor} hover:scale-105`
                                      )}
                                    >
                                      <btn.icon
                                        className={cn(
                                          "w-4 h-4 transition-all duration-300",
                                          isActive && "fill-current"
                                        )}
                                      />
                                      {isActive && (
                                        <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] text-xs">
                                    <p>
                                      {isActive ? "Remove from " : "Add to "}
                                      <span className="font-bold">{btn.label}</span>
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
