"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// --- INTERFACES ---
interface SolvedQuestion {
  id: string;
  updatedAt: Date;
  question: {
    id: string;
    title: string;
    difficulty: string;
    slug?: string;
    externalPlatformUrl: string;
  };
}

interface Discussion {
  id: string;
  title: string;
  createdAt: Date;
  likeCount: number;
  dislikeCount: number;
  _count: { comments: number };
}

interface Comment {
  id: string;
  description: string;
  createdAt: Date;
  discussion: { id: string; title: string };
}

interface Props {
  solvedQuestions: SolvedQuestion[];
  discussions: Discussion[];
  comments: Comment[];
}

export function ProfileActivityTabs({
  solvedQuestions,
  discussions,
  comments,
}: Props) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-[#eaddcf] border-b border-[#3e2723] pb-4">
        Dojo Activity
      </h2>

      <Tabs defaultValue="solved" className="w-full">
        {/* --- TAB NAVIGATION (Responsive Scroll) --- */}
        <div className="w-full overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {/* FIX: Changed w-full to 'inline-flex w-max min-w-full md:w-full' */}
          {/* This ensures the border/background stretches with the scroll on mobile */}
          <TabsList className="bg-[#1a110d] border border-[#3e2723] p-1 h-auto inline-flex w-max min-w-full md:w-full justify-start gap-2 rounded-xl">
            <TabButton
              value="solved"
              icon={CheckCircle2}
              label="Solved Katas"
              count={solvedQuestions.length}
            />
            <TabButton
              value="discussions"
              icon={MessageSquare}
              label="Discussions"
              count={discussions.length}
            />
            <TabButton
              value="comments"
              icon={MessageCircle}
              label="Comments"
              count={comments.length}
            />
          </TabsList>
        </div>

        {/* --- 1. SOLVED QUESTIONS TAB --- */}
        <TabsContent value="solved" className="mt-0">
          <ScrollArea className="h-[400px] md:h-[500px] w-full pr-2 md:pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {solvedQuestions.length > 0 ? (
              <div className="flex flex-col gap-1 p-1 md:p-2">
                {solvedQuestions.map((item) => (
                  <Link
                    key={item.id}
                    href={item.question.externalPlatformUrl}
                    target="_blank"
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 md:gap-4 w-full">
                      <div className="mt-1 sm:mt-0 shrink-0 p-1.5 md:p-2 rounded-full bg-green-900/20 text-green-500 border border-green-900/50">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm md:text-base text-[#eaddcf] group-hover:text-[#d4af37] transition-colors truncate pr-2">
                          {item.question.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 md:mt-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] h-5 border px-1.5",
                              item.question.difficulty === "Easy"
                                ? "text-green-400 border-green-900/30"
                                : item.question.difficulty === "Medium"
                                ? "text-yellow-400 border-yellow-900/30"
                                : "text-red-400 border-red-900/30"
                            )}
                          >
                            {item.question.difficulty}
                          </Badge>
                          <span className="text-[10px] md:text-xs text-[#5d4037] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(item.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="hidden sm:block w-4 h-4 text-[#3e2723] group-hover:text-[#d4af37] transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState label="No katas solved yet. Go train!" />
            )}
          </ScrollArea>
        </TabsContent>

        {/* --- 2. DISCUSSIONS TAB --- */}
        <TabsContent value="discussions" className="mt-0">
          <ScrollArea className="h-[400px] md:h-[500px] w-full pr-2 md:pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {discussions.length > 0 ? (
              <div className="flex flex-col gap-1 p-1 md:p-2">
                {discussions.map((disc) => (
                  <Link
                    key={disc.id}
                    href={`/discussions/${disc.id}`}
                    className="group flex flex-col sm:flex-row items-start justify-between p-3 md:p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all gap-2"
                  >
                    <div className="space-y-1 w-full">
                      <h4 className="font-semibold text-sm md:text-base text-[#eaddcf] group-hover:text-blue-400 transition-colors line-clamp-1">
                        {disc.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-xs text-[#a1887f]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(disc.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 text-[#d4af37]">
                          <ThumbsUp className="w-3 h-3" />
                          {disc.likeCount} Likes
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{disc._count.comments} Comments</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState label="No discussions started." />
            )}
          </ScrollArea>
        </TabsContent>

        {/* --- 3. COMMENTS TAB --- */}
        <TabsContent value="comments" className="mt-0">
          <ScrollArea className="h-[400px] md:h-[500px] w-full pr-2 md:pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {comments.length > 0 ? (
              <div className="flex flex-col gap-1 p-1 md:p-2">
                {comments.map((comment) => (
                  <Link
                    key={comment.id}
                    href={`/discussions/${comment.discussion.id}`}
                    className="group p-3 md:p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all block"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] md:text-xs text-[#5d4037] mb-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>
                          Commented on{" "}
                          <span className="text-[#a1887f] font-medium ml-1">
                            {comment.discussion.title}
                          </span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[#eaddcf]/80 line-clamp-2 italic border-l-2 border-[#3e2723] pl-3 group-hover:border-[#d4af37] transition-colors">
                        "{comment.description}"
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState label="No comments made yet." />
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function TabButton({ value, icon: Icon, label, count }: any) {
  return (
    <TabsTrigger
      value={value}
      // FIX: Added whitespace-nowrap to prevent text wrapping causing layout tear
      className="flex-1 data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] py-2 md:py-3 px-2 md:px-4 rounded-lg transition-all duration-300 min-w-fit whitespace-nowrap"
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3 h-3 md:w-4 md:h-4" />
        <span className="font-semibold text-xs md:text-sm">{label}</span>
        <span className="ml-1 text-[10px] md:text-xs opacity-70 bg-black/10 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
    </TabsTrigger>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-40 flex flex-col items-center justify-center text-[#5d4037] gap-2">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-dashed border-[#3e2723] flex items-center justify-center">
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 opacity-20" />
      </div>
      <p className="text-xs md:text-sm font-mono">{label}</p>
    </div>
  );
}