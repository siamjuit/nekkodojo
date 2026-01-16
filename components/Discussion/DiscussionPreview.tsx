"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ArrowUpRight, Bookmark, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BeltBadge from "../User/BeltBadge";
import { useEffect, useState } from "react";
import { getTags } from "@/lib/getTags";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  data: DiscussionProps;
  onRemove?: (id: string) => void;
}

export default function DiscussionPreviewCard({ data, onRemove }: Props) {
  const [tags, setTags] = useState<TagProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(data.isBookmarked);

  useEffect(() => {
    const getAllTags = async () => {
      try {
        const t: TagProps[] = await getTags();
        if (t) setTags(t);
      } catch (error) {
        console.error(error);
      }
    };
    getAllTags();
  }, []);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      const res = await fetch(`/api/discussions/${data.id}/bookmark`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Action failed");

      toast.success(previousState ? "Bookmark removed." : "Discussion saved.");

      if (onRemove && previousState === true) {
        onRemove(data.id);
      }
    } catch (error) {
      setIsBookmarked(previousState);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const postTag = tags.find((t) => t.slug === data.tag.slug);

  return (
    <div className="group relative bg-[#1a110d]/40 border border-[#3e2723] rounded-xl p-5 hover:border-[#d4af37]/50 hover:bg-[#1a110d]/60 transition-all duration-300 overflow-hidden">
      
      {/* --- ACTIVE STATE: RIBBON (Absolute) --- */}
      {/* Only render absolute ribbon if bookmarked */}
      {isBookmarked && (
        <div 
          className="absolute top-0 right-4 z-20 cursor-pointer" 
          onClick={toggleBookmark}
        >
          <div className="bg-[#d4af37] w-6 h-8 flex items-center justify-center rounded-b-sm shadow-[0_4px_10px_rgba(212,175,55,0.3)] hover:bg-[#b5952f] transition-colors animate-in slide-in-from-top-2">
            {loading ? (
              <Loader2 size={14} className="text-[#1a110d] animate-spin" />
            ) : (
              <Bookmark size={14} className="fill-[#1a110d] text-[#1a110d]" />
            )}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* --- LEFT CONTENT --- */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 text-xs text-[#a1887f]">
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#3e2723]">
              <Image
                src={data.author.profileUrl || "/default-avatar.png"}
                alt="Author"
                fill
                className="object-cover"
              />
            </div>
            <Link href={`/member/${data.author.name}`} className="font-bold text-[#d4af37]">
              {data.author.firstName} {data.author.lastName}
            </Link>
            <BeltBadge belt={data.author.beltRank!} />
            <span className="w-1 h-1 rounded-full bg-[#3e2723]" />
            <span>{formatDistanceToNow(new Date(data.createdAt))} ago</span>
          </div>

          <Link
            href={`/discussions/${data.id}`}
            target="_top"
            className="block group-hover:translate-x-1 transition-transform duration-300"
          >
            <h3 className="text-lg font-bold text-[#eaddcf] group-hover:text-[#d4af37] truncate pr-8">
              {data.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {postTag && (
              <Badge
                variant="outline"
                className={`px-2 py-0 rounded text-[10px] font-mono whitespace-nowrap border ${postTag.color} hover:bg-transparent`}
              >
                {postTag.name}
              </Badge>
            )}

            <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1887f] bg-[#0f0b0a] px-2 py-1 rounded border border-[#3e2723]">
              <ThumbsUp size={12} className="text-[#d4af37]" />
              <span>{data.likeCount || 0}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#a1887f]">
              <MessageSquare size={12} />
              <span>{data._count.comments} comments</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT ACTION COLUMN --- */}
        <div className="flex flex-col items-center gap-3">
            
            {/* INACTIVE STATE: GRAY ICON (Stacked normally) */}
            {!isBookmarked && (
                <button
                    onClick={toggleBookmark}
                    className="p-2 rounded-full hover:bg-[#3e2723]/50 text-[#5d4037] hover:text-[#d4af37] transition-all"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Bookmark size={18} />
                    )}
                </button>
            )}

            {/* OPEN ARROW (Pushed down if ribbon exists) */}
            <Link
                href={`/discussions/${data.id}`}
                target="_top"
                className={cn(
                    "hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#3e2723] text-[#5d4037] group-hover:text-[#d4af37] group-hover:border-[#d4af37] transition-all",
                    isBookmarked ? "mt-8" : "" // Push down only if Ribbon is present
                )}
            >
                <ArrowUpRight size={20} />
            </Link>
        </div>
      </div>
    </div>
  );
}