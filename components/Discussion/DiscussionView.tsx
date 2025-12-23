"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import MarkdownViewer from "@/components/Discussion/Create/MarkdownViewer";
import VoteControl from "@/components/Discussion/VoteControl";
import DiscussionDropDown from "./DiscussionDropDown";
import Share from "./Share";
import { TAGS } from "@/constants/tags";
import { Badge } from "../ui/badge";
import { AttachmentCarousel } from "../Attachment/AttCarousal";

export default function DiscussionViewer({ discussion }: { discussion: DiscussionProps }) {
  const postTag = TAGS.find((t) => t.value === discussion.tag);

  return (
    <article className="bg-[#1a110d]/40 border border-[#3e2723] rounded-xl overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 sm:p-8 border-b border-[#3e2723]/50 bg-[#1a110d]/60">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#eaddcf] leading-tight">
              {discussion.title}
            </h1>
            {postTag && (
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border ${postTag.style} hover:bg-transparent`}
                >
                  {postTag.label}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border border-[#d4af37]/30 overflow-hidden bg-black shrink-0">
                <Image
                  src={discussion.author.profileUrl || "/default-avatar.png"}
                  alt="Author"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#d4af37]">
                    {discussion.author.firstName} {discussion.author.lastName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
                    {discussion.author.beltRank || "White Belt"}
                  </span>
                </div>
                <p className="text-xs text-[#a1887f]">
                  posted {formatDistanceToNow(new Date(discussion.createdAt))} ago
                </p>
              </div>
            </div>
          </div>
          <DiscussionDropDown discussion={discussion} authorId={discussion.authorId} />
        </div>
      </div>
      <div className="p-6 sm:p-8 space-y-8">
        <div className="min-h-20">
          <MarkdownViewer content={discussion.description} />
        </div>
        {discussion.attachments && discussion.attachments.length > 0 && (
          <AttachmentCarousel attachments={discussion.attachments} />
        )}
      </div>

      <div className="px-6 py-4 bg-[#0f0b0a]/30 border-t border-[#3e2723] flex flex-wrap items-center justify-between gap-4">
        <VoteControl
          discussionId={discussion.id}
          initialUpvotes={discussion.likeCount || 0}
          initialDownvotes={discussion.disLikeCount || 0}
          initialUserVote={discussion.userVote || null}
          isLiked={discussion.chkLike || false}
          isDisliked={discussion.chkDis || false}
        />

        <Share />
      </div>
    </article>
  );
}
