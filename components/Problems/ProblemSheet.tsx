"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Unlock, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DojoProgress } from "../ui/dojo-progress";

type QuestionStatus = "unvisited" | "attempted" | "completed";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  externalPlatformUrl: string;
  solutionUrl: string | null;
}

interface Category {
  id: string;
  name: string;
  questions: Question[];
}

interface Props {
  data: Category[];
}

export default function QuestionExplorer({ data }: Props) {
  const [progress, setProgress] = useState<Record<string, QuestionStatus>>({});

  useEffect(() => {
    const getUserProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) {
          toast.error("Couldn't get the user progress!");
          return;
        }

        const data = await res.json();
        const progressMap: Record<string, QuestionStatus> = {};
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            progressMap[item.questionId] = item.status as QuestionStatus;
          });
        }
        setProgress(progressMap);
      } catch (error) {
        console.error("Progress sync error", error);
      }
    };

    getUserProgress();
  }, []);
  const handleAttempt = async (q: Question) => {
    const currentStatus = progress[q.id] || "unvisited";
    if (currentStatus !== "unvisited") return;
    setProgress((prev) => ({
      ...prev,
      [q.id]: "attempted",
    }));

    try {
      const res = await fetch(`/api/progress/attempted?questionId=${q.id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to sync attempt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not save progress");
      setProgress((prev) => ({
        ...prev,
        [q.id]: "unvisited",
      }));
    }
  };

  const toggleSolved = async (qId: string, isChecked: boolean) => {
    const previousStatus = progress[qId];
    setProgress((prev) => ({
      ...prev,
      [qId]: isChecked ? "completed" : "attempted",
    }));

    try {
      const res = await fetch(`/api/progress/status?questionId=${qId}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to sync");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save progress");
      setProgress((prev) => ({
        ...prev,
        [qId]: previousStatus,
      }));
    }
  };

  return (
    <div className="w-full space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {data.map((category) => {
          const totalQuestions = category.questions.length;
          const solvedCount = category.questions.filter(
            (q) => progress[q.id] === "completed"
          ).length;
          const percentComplete =
            totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
          const isCategoryCompleted = percentComplete === 100;
          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className={cn(
                "border rounded-xl px-4 overflow-hidden transition-colors",
                isCategoryCompleted
                  ? "border-green-900/50 bg-[#1a110d] shadow-[0_0_15px_-3px_rgba(22,163,74,0.1)]"
                  : "border-[#3e2723] bg-[#1a110d]"
              )}
            >
              {/* Category Header */}
              <AccordionTrigger className="hover:no-underline py-5 group">
                <div className="flex items-center gap-4 w-full pr-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-lg font-bold transition-colors",
                          isCategoryCompleted
                            ? "text-green-500"
                            : "text-[#eaddcf] group-hover:text-[#d4af37]"
                        )}
                      >
                        {category.name}
                      </span>
                      {isCategoryCompleted && (
                        <Badge
                          variant="outline"
                          className="border-green-600 bg-green-900/20 text-green-400 gap-1 px-2"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#a1887f]">
                      {solvedCount} / {totalQuestions} ({percentComplete}%)
                    </span>
                  </div>
                  <DojoProgress value={percentComplete} />
                </div>
              </AccordionTrigger>

              {/* Content */}
              <AccordionContent className="pb-4 pt-0">
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#3e2723]/30 ml-2 mt-2">
                  {category.questions.length === 0 ? (
                    <div className="text-sm text-[#5d4037] italic py-2">No katas available.</div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((q, idx) => {
                        const status = progress[q.id] || "unvisited";
                        const isSolved = status === "completed";
                        const isAttempted = status === "attempted" || isSolved;

                        return (
                          <AccordionItem key={q.id} value={q.id} className="border-b-0 mb-1">
                            {/* --- FIX: Wrapper Div replaces Checkbox nesting error --- */}
                            <div className="flex items-center w-full rounded-lg hover:bg-[#3e2723]/20 transition-colors group/q pr-2">
                              {/* 1. Checkbox Area (Outside Trigger) */}
                              <div className="pl-3 py-3 flex items-center">
                                <Checkbox
                                  checked={isSolved}
                                  onCheckedChange={(checked) =>
                                    toggleSolved(q.id, checked as boolean)
                                  }
                                  disabled={status === "unvisited"}
                                  className={cn(
                                    "w-5 h-5 border-[#3e2723] transition-all data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                                    status === "unvisited" && "opacity-30 cursor-not-allowed"
                                  )}
                                />
                              </div>

                              {/* 2. Accordion Trigger (Title & Meta) */}
                              <AccordionTrigger className="hover:no-underline py-3 px-4 flex-1">
                                <div className="flex items-center gap-4 w-full">
                                  {/* Number */}
                                  <span className="font-mono text-xs text-[#5d4037]">
                                    {(idx + 1).toString().padStart(2, "0")}
                                  </span>

                                  {/* Title */}
                                  <span
                                    className={cn(
                                      "text-sm font-medium transition-all text-left flex-1",
                                      isSolved
                                        ? "text-[#a1887f] line-through decoration-[#3e2723]"
                                        : "text-[#eaddcf] group-hover/q:text-[#d4af37]"
                                    )}
                                  >
                                    {q.title}
                                  </span>

                                  {/* Difficulty & Status Icon */}
                                  <div className="ml-auto flex items-center gap-3">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] h-5 border-none bg-[#3e2723]/30 min-w-[60px] justify-center hidden sm:flex",
                                        q.difficulty === "Easy"
                                          ? "text-green-400"
                                          : q.difficulty === "Medium"
                                            ? "text-yellow-400"
                                            : "text-red-400"
                                      )}
                                    >
                                      {q.difficulty}
                                    </Badge>

                                    {isSolved && (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                            </div>

                            {/* Expanded Content */}
                            <AccordionContent className="px-12 pb-6 pt-0">
                              <div className="space-y-4">
                                <p className="text-sm text-[#a1887f] leading-relaxed border-l-2 border-[#d4af37]/20 pl-4">
                                  {q.description}
                                </p>

                                <div className="flex flex-wrap gap-3 pt-2 items-center">
                                  {/* Solve Button */}
                                  <Button
                                    asChild
                                    size="sm"
                                    onClick={() => handleAttempt(q)}
                                    className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-semibold h-9 px-4"
                                  >
                                    <Link
                                      href={q.externalPlatformUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                      Solve Problem
                                    </Link>
                                  </Button>

                                  {/* --- FIXED SOLUTION BUTTON --- */}
                                  {q.solutionUrl && (
                                    <Button
                                      asChild={isAttempted}
                                      disabled={!isAttempted}
                                      size="sm"
                                      variant="outline"
                                      className={cn(
                                        "h-9 px-4 border-[#3e2723] bg-transparent transition-all flex items-center gap-2",
                                        isAttempted
                                          ? "text-[#eaddcf] hover:text-[#d4af37] hover:border-[#d4af37] cursor-pointer"
                                          : "text-[#5d4037] opacity-60 cursor-not-allowed hover:bg-transparent"
                                      )}
                                    >
                                      {isAttempted ? (
                                        <Link
                                          href={q.solutionUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2"
                                        >
                                          <Unlock className="w-3.5 h-3.5" />
                                          <span>View Solution</span>
                                        </Link>
                                      ) : (
                                        <span className="flex items-center gap-2">
                                          <Lock className="w-3.5 h-3.5" />
                                          <span>Solution Locked</span>
                                        </span>
                                      )}
                                    </Button>
                                  )}
                                </div>

                                {!isAttempted && (
                                  <p className="text-[10px] text-[#5d4037] italic">
                                    * The solution scroll is sealed. Attempt the kata to break the
                                    seal.
                                  </p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
