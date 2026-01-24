"use client";

import { useState, useEffect } from "react"; // ✅ Add useEffect
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UploaderComment, { UploadFile } from "./UploaderComment";
import attFromKit from "@/lib/actions/removeAtt";
import { ensureUserStatus } from "@/app/(root)/discussions/create/_actions";

interface Props {
  discussionId: string;
  authorId: string;
  userAvatar?: string | null;
  parentId?: string;
  onCommentSubmitted?: (newComment: CommentProps) => void;
}

const WriteComment = ({
  discussionId,
  authorId,
  userAvatar,
  parentId,
  onCommentSubmitted,
}: Props) => {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [post, setPost] = useState<UploadFile | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ AUTO-CLEANUP TRIGGER
  // As soon as this component renders, check if the user's ban has expired.
  // If it has, the server updates them to "Active" before they even type.
  useEffect(() => {
    ensureUserStatus();
  }, []);

  const handleUploadSuccess = (newFile: UploadFile) => {
    setPost(newFile);
    setIsFocused(true);
  };

  const removeAttachment = () => {
    if (post) attFromKit(post.id);
    setPost(null);
  };

  const handleCancel = () => {
    setDescription("");
    setPost(null);
    if (post) attFromKit(post.id);
    setIsFocused(false);
  };

  const handleSubmit = async () => {
    if (!description.trim() && !post) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description,
          discussionId: discussionId,
          parentId: parentId || null,
          attachment: post
            ? {
                id: post.id,
                type: post.type,
                postUrl: post.postUrl,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const newCommentData = await response.json();

      const completeComment: CommentProps = {
        ...newCommentData,
        likeCount: 0,
        dislikeCount: 0,
        isLiked: false,
        isDisliked: false,
        replies: [],
        _count: { replies: 0 },
      };

      toast.success("Comment posted successfully");
      setDescription("");
      setPost(null);
      if (onCommentSubmitted) onCommentSubmitted(completeComment);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToolbar = isFocused || description.length > 0 || post !== null;

  return (
    <div className="flex gap-4 w-full mb-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="shrink-0 relative w-10 h-10 rounded-full overflow-hidden border border-[#3e2723]">
        <Image src={userAvatar!} alt="User" fill className="object-cover" />
      </div>
      <div className="flex-1 space-y-3">
        <div
          className={`relative transition-all duration-200 ${
            isFocused ? "opacity-100" : "opacity-80 hover:opacity-100"
          }`}
        >
          <Textarea
            placeholder="Add a comment..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            disabled={isSubmitting}
            className="min-h-10 bg-transparent border-0 border-b border-[#3e2723] rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#d4af37] resize-none text-[#eaddcf] placeholder:text-[#5d4037] leading-relaxed"
          />
          <div
            className={`absolute bottom-0 left-0 h-px bg-[#d4af37] transition-all duration-300 ${
              isFocused ? "w-full" : "w-0"
            }`}
          />
        </div>
        {post && (
          <div className="relative w-fit group animate-in zoom-in-95 duration-200">
            <div className="relative h-20 w-20 rounded-md overflow-hidden border border-[#3e2723]">
              <Image src={post.postUrl} alt="Attachment" fill className="object-cover" />
            </div>
            <button
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 bg-[#1a110d] text-[#a1887f] hover:text-red-400 border border-[#3e2723] rounded-full p-1 shadow-lg transition-colors z-10"
              title="Remove attachment"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {showToolbar && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="w-[140px]">
              <UploaderComment onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="text-[#a1887f] hover:text-[#eaddcf] hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={(!description.trim() && !post) || isSubmitting}
                className="bg-[#3e2723] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a110d] disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 font-bold transition-all py-1"
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteComment;
