"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import DiscussionViewer from "@/components/Discussion/DiscussionView";
import { checkDislike, checkLike } from "@/lib/actions/isLiked";
import CommentSection from "@/components/Comment/CommentSection";
import { useUser } from "@clerk/nextjs";
import { checkIsDiscussionMarked } from "@/lib/actions/isMarked";

export default function DiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [discussion, setDiscussion] = useState<DiscussionProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const discussionId = params?.discussionId as string;

  useEffect(() => {
    if (!discussionId) return;

    const fetchDiscussion = async () => {
      try {
        const res = await fetch(`/api/discussions/${discussionId}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("Discussion not found");
          throw new Error("Failed to load discussion");
        }

        const data = await res.json();
        setDiscussion(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [discussionId]);
  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 text-[#d4af37] animate-spin" />
        <p className="text-[#a1887f] text-sm animate-pulse">Summoning scroll...</p>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-[#0f0b0a] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="size-12 text-red-500/80" />
        <h2 className="text-xl font-bold text-[#eaddcf]">Scroll Not Found</h2>
        <p className="text-[#a1887f] max-w-md">
          {error || "This discussion seems to have vanished from the archives."}
        </p>
        <button
          onClick={() => router.push("/discussions")}
          className="mt-4 px-6 py-2 bg-[#1a110d] border border-[#3e2723] text-[#d4af37] rounded-lg hover:bg-[#3e2723] transition-colors"
        >
          Return to Dojo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="mb-6">
          <Link
            href="/discussions"
            className="inline-flex items-center text-sm text-[#a1887f] hover:text-[#d4af37] transition-colors gap-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dojo
          </Link>
        </div>
        <DiscussionViewer discussion={discussion} />
        <div className="mt-8 border-t border-[#3e2723] pt-8 text-center">
          <p className="text-start text-xl font-bold pb-8">
            Comments ({discussion._count.comments})
          </p>
          <CommentSection discussionId={discussionId} authorId={discussion.authorId} />
        </div>
      </div>
    </div>
  );
}
