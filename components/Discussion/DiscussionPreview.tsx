"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ArrowUpRight, Bookmark } from "lucide-react"; // Import Bookmark
import { Badge } from "@/components/ui/badge";
import { TAGS } from "@/constants/tags";
import BeltBadge from "../User/BeltBadge";

export default function DiscussionPreviewCard({ data }: { data: DiscussionProps }) {
  const tagConfig = TAGS.find((t) => t.value === data.tag);

  return (
    <div className="group relative bg-[#1a110d]/40 border border-[#3e2723] rounded-xl p-5 hover:border-[#d4af37]/50 hover:bg-[#1a110d]/60 transition-all duration-300 overflow-hidden">
      {data.isBookmarked && (
        <div className="absolute top-0 right-4">
          {/* Ribbon Shape */}
          <div className="bg-[#d4af37] w-6 h-8 flex items-center justify-center rounded-b-sm shadow-[0_4px_10px_rgba(212,175,55,0.3)] animate-in slide-in-from-top-2">
            <Bookmark size={14} className="fill-[#1a110d] text-[#1a110d]" />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
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
            <span className="font-bold text-[#d4af37]">
              {data.author.firstName} {data.author.lastName}
            </span>
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
            {tagConfig && (
              <Badge
                variant="outline"
                className={`px-2 py-0 rounded text-[10px] font-mono whitespace-nowrap border ${tagConfig.style} hover:bg-transparent`}
              >
                {tagConfig.label}
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

        {/* Hide default arrow if bookmarked to avoid crowding, or shift it down/left */}
        <Link
          href={`/discussions/${data.id}`}
          target="_top"
          className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#3e2723] text-[#5d4037] group-hover:text-[#d4af37] group-hover:border-[#d4af37] transition-all
             ${data.isBookmarked ? "mt-8" : ""} 
          `}
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </div>
  );
}
