"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, BookmarkX, MessageCircle, FileText, ArrowRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionPreviewCard from "@/components/Discussion/DiscussionPreview";
import CommentItem from "@/components/Comment/Comment";

export default function BookmarksPage() {
  const [markedDiscussions, setMarkedDiscussions] = useState<DiscussionProps[]>([]);
  const [markedComments, setMarkedComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- DEBUGGING: Check your console to see exactly what URL is being called ---
        console.log("Fetching bookmarks from: /api/users/bookmarks");
        
        const response = await fetch("/api/users/bookmarks");
        
        if (!response.ok) {
           const errorText = await response.text();
           console.error("Fetch Error:", response.status, errorText);
           throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        
        console.log("Bookmarks Data Received:", data); // Check if data is empty or populated
        
        setMarkedDiscussions(data.discussions || []);
        setMarkedComments(data.comments || []);
      } catch (error) {
        console.error("Critical Bookmark Error:", error);
        toast.error("Could not load your saved scrolls");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-[#d4af37]" size={40} />
      </div>
    );
  }

  // --- TAB STYLING (Reddit Style) ---
  // We use !important classes (e.g., !text-...) to override Shadcn's default button look
  const tabTriggerClass = `
    relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-6 pb-3 pt-2 
    font-bold text-[#a1887f] shadow-none transition-all 
    hover:text-[#eaddcf] hover:bg-[#3e2723]/10
    
    data-[state=active]:!border-[#d4af37] 
    data-[state=active]:!text-[#d4af37] 
    data-[state=active]:!bg-transparent 
    data-[state=active]:!shadow-none
  `;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-[#d4af37] tracking-tight">Saved Scrolls</h1>
        <p className="text-[#a1887f] text-sm">
          Your collection of bookmarked techniques and discussions.
        </p>
      </div>

      {/* TABS */}
      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-[#3e2723] bg-transparent p-0">
          <TabsTrigger value="discussions" className={tabTriggerClass}>
            <FileText className="mr-2 h-4 w-4" />
            Discussions
            <span className="ml-2 rounded-full bg-[#3e2723] px-2 py-0.5 text-xs text-[#d4af37]">
              {markedDiscussions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="comments" className={tabTriggerClass}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Comments
            <span className="ml-2 rounded-full bg-[#3e2723] px-2 py-0.5 text-xs text-[#d4af37]">
              {markedComments.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* --- DISCUSSIONS TAB --- */}
        <TabsContent
          value="discussions"
          className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {markedDiscussions.length > 0 ? (
            markedDiscussions.map((discussion) => (
              <DiscussionPreviewCard key={discussion.id} data={discussion} />
            ))
          ) : (
            <EmptyState label="No saved discussions found." />
          )}
        </TabsContent>

        {/* --- COMMENTS TAB --- */}
        <TabsContent
          value="comments"
          className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {markedComments.length > 0 ? (
            markedComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 p-4 transition-all hover:border-[#d4af37]/30"
              >
                {/* Context Header: Links to the discussion */}
                <Link
                  href={`/discussions/${comment.discussionId}`}
                  className="mb-3 flex items-center gap-2 text-xs font-medium text-[#a1887f] hover:text-[#d4af37] w-fit group"
                >
                  <span>View original discussion</span>
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                {/* The Comment Component */}
                <div className="pl-2 border-l-2 border-[#3e2723]">
                  <CommentItem
                    comment={comment}
                    depth={0}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState label="No saved comments found." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple Empty State Sub-component
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/20">
      <div className="bg-[#3e2723]/20 p-4 rounded-full mb-4">
        <BookmarkX className="h-8 w-8 text-[#5d4037]" />
      </div>
      <p className="text-[#a1887f] font-mono">{label}</p>
    </div>
  );
}