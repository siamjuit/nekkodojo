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
  // Comments are strictly for discussions now
  discussion: { id: string; title: string };
}

interface Props {
  solvedQuestions: SolvedQuestion[];
  discussions: Discussion[];
  comments: Comment[];
}

export function ProfileActivityTabs({ solvedQuestions, discussions, comments }: Props) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-[#eaddcf] border-b border-[#3e2723] pb-4">
        Dojo Activity
      </h2>

      <Tabs defaultValue="solved" className="w-full">
        {/* --- TAB NAVIGATION --- */}
        <TabsList className="bg-[#1a110d] border border-[#3e2723] p-1 h-auto w-full justify-start gap-2 rounded-xl mb-6">
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

        {/* --- 1. SOLVED QUESTIONS TAB --- */}
        <TabsContent value="solved" className="mt-0">
          <ScrollArea className="h-[500px] w-full pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {solvedQuestions.length > 0 ? (
              <div className="flex flex-col gap-1 p-2">
                {solvedQuestions.map((item) => (
                  <Link
                    key={item.id}
                    href={item.question.externalPlatformUrl}
                    target="_blank"
                    className="group flex items-center justify-between p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-green-900/20 text-green-500 border border-green-900/50">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#eaddcf] group-hover:text-[#d4af37] transition-colors">
                          {item.question.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
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
                          <span className="text-xs text-[#5d4037] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#3e2723] group-hover:text-[#d4af37] transition-colors" />
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
          <ScrollArea className="h-[500px] w-full pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {discussions.length > 0 ? (
              <div className="flex flex-col gap-1 p-2">
                {discussions.map((disc) => (
                  <Link
                    key={disc.id}
                    href={`/discussions/${disc.id}`}
                    className="group flex items-start justify-between p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-[#eaddcf] group-hover:text-blue-400 transition-colors">
                        {disc.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-[#a1887f]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(disc.createdAt), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#d4af37]">
                          <ThumbsUp className="w-3 h-3" />
                          {disc.likeCount} Likes
                        </span>
                        <span>•</span>
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
          <ScrollArea className="h-[500px] w-full pr-4 rounded-xl border border-[#3e2723] bg-[#1a110d] p-1">
            {comments.length > 0 ? (
              <div className="flex flex-col gap-1 p-2">
                {comments.map((comment) => (
                  <Link
                    key={comment.id}
                    href={`/discussions/${comment.discussion.id}`}
                    className="group p-4 rounded-lg hover:bg-[#0f0b0a] border border-transparent hover:border-[#3e2723] transition-all block"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-[#5d4037] mb-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>
                          Commented on discussion{" "}
                          <span className="text-[#a1887f] font-medium ml-1">
                            {comment.discussion.title}
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-[#eaddcf]/80 line-clamp-2 italic border-l-2 border-[#3e2723] pl-3 group-hover:border-[#d4af37] transition-colors">
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
      className="flex-1 data-[state=active]:bg-[#d4af37] data-[state=active]:text-black text-[#a1887f] py-3 rounded-lg transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="font-semibold">{label}</span>
        <span className="ml-1 text-xs opacity-70 bg-black/10 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
    </TabsTrigger>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-40 flex flex-col items-center justify-center text-[#5d4037] gap-2">
      <div className="w-12 h-12 rounded-full border border-dashed border-[#3e2723] flex items-center justify-center">
        <MessageSquare className="w-6 h-6 opacity-20" />
      </div>
      <p className="text-sm font-mono">{label}</p>
    </div>
  );
}
