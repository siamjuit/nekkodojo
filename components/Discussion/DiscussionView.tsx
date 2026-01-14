"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import MarkdownViewer from "@/components/Discussion/Create/MarkdownViewer";
import VoteControl from "@/components/Discussion/VoteControl";
import DiscussionDropDown from "./DiscussionDropDown";
import Share from "./Share";
import { Badge } from "../ui/badge";
import { AttachmentCarousel } from "../Attachment/AttCarousal";
import BeltBadge from "../User/BeltBadge";
import { useEffect, useState } from "react";
import { getTags } from "@/lib/getTags";
import Link from "next/link";

export default function DiscussionViewer({ discussion }: { discussion: DiscussionProps }) {
  const [tags, setTags] = useState<TagProps[]>([]);
  console.log(discussion);
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

  const postTag = tags.find((t) => t.slug === discussion.tag.slug);

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
                  // CHANGE 2: Use 'color' instead of 'style'
                  className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border ${postTag.color} hover:bg-transparent`}
                >
                  {/* CHANGE 3: Use 'name' instead of 'label' */}
                  {postTag.name}
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
                  <Link
                    href={`/${discussion.author.name}`}
                    className="text-sm font-bold text-[#d4af37]"
                  >
                    {discussion.author.firstName} {discussion.author.lastName}
                  </Link>
                  <BeltBadge belt={discussion.author.beltRank!} />
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
          initialDownvotes={discussion.dislikeCount || 0}
          initialUserVote={discussion.userVote || null}
          isLiked={discussion.isLiked || false}
          isDisliked={discussion.isDisliked || false}
        />

        <Share />
      </div>
    </article>
  );
}
