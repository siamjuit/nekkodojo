"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ArrowUpRight } from "lucide-react";

interface DiscussionProps {
  id: string;
  title: string;
  likeCount: number;
  author: {
    firstName: string | null;
    lastName: string | null;
    profileUrl: string | null;
    beltRank: string | null;
  };
  _count: {
    comments: number;
  };
  createdAt: string;
  // We can also pass upvotes/downvotes directly if your API returns them on the root object
  upvotes?: number; 
}

export default function DiscussionPreviewCard({ data }: { data: DiscussionProps }) {
  return (
    <div className="group relative bg-[#1a110d]/40 border border-[#3e2723] rounded-xl p-5 hover:border-[#d4af37]/50 hover:bg-[#1a110d]/60 transition-all duration-300">
      
      <div className="flex items-start justify-between gap-4">
        
        {/* Left Side: Content */}
        <div className="flex-1 min-w-0">
          {/* Meta Header */}
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
            <span className="w-1 h-1 rounded-full bg-[#3e2723]" />
            <span>{formatDistanceToNow(new Date(data.createdAt))} ago</span>
          </div>

          {/* Title Link */}
          <Link href={`/discussions/${data.id}`} className="block group-hover:translate-x-1 transition-transform duration-300">
            <h3 className="text-lg font-bold text-[#eaddcf] group-hover:text-[#d4af37] truncate pr-4">
              {data.title}
            </h3>
          </Link>

          {/* Stats Footer */}
          <div className="flex items-center gap-4 mt-4">
            {/* Vote Count Badge */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1887f] bg-[#0f0b0a] px-2 py-1 rounded border border-[#3e2723]">
              <ThumbsUp size={12} className="text-[#d4af37]" />
              <span>{data.upvotes || data.likeCount || 0}</span>
            </div>
            
            {/* Comment Count */}
            <div className="flex items-center gap-1.5 text-xs text-[#a1887f]">
              <MessageSquare size={12} />
              <span>{data._count.comments} comments</span>
            </div>

            {/* Tags/Rank (Optional) */}
            <span className="text-[10px] uppercase tracking-wider text-[#5d4037] border border-[#3e2723] px-1.5 py-0.5 rounded">
                {data.author.beltRank || "White Belt"}
            </span>
          </div>
        </div>

        {/* Right Side: Action Arrow */}
        <Link 
            href={`/discussions/${data.id}`}
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#3e2723] text-[#5d4037] group-hover:text-[#d4af37] group-hover:border-[#d4af37] transition-all"
        >
            <ArrowUpRight size={20} />
        </Link>
      </div>
    </div>
  );
}