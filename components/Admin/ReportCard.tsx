"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  ShieldCheck, 
  Trash2, 
  Loader2, 
  ExternalLink, 
  MessageSquare, 
  FileText 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { dismissReport, deleteDiscussion, deleteComment } from "@/app/(admin)/_actions"; 
import { toast } from "sonner";
import Link from "next/link";

// Define Props Interface
interface ReportProps {
  id: string;
  reason: string;
  createdAt: Date;
  status: string;
  reporter: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
  };
  discussion?: { id: string; title: string };
  comment?: { id: string; content: string; discussionId: string };
}

export function ReportCard({ report }: { report: ReportProps }) {
  const [isPending, startTransition] = useTransition();

  const isDiscussion = !!report.discussion;
  const contentId = isDiscussion ? report.discussion!.id : report.comment!.id;
  
  // Handlers
  const handleDismiss = () => {
    const formData = new FormData();
    formData.append("id", report.id);
    startTransition(async () => {
      await dismissReport(formData);
      toast.success("Report dismissed (Absolved)");
    });
  };

  // Logic to run AFTER confirmation
  const executeDelete = () => {
    const formData = new FormData();
    formData.append("id", contentId);
    
    startTransition(async () => {
      try {
        if (isDiscussion) await deleteDiscussion(formData);
        else await deleteComment(formData);
        toast.success("Content removed (Judgment Executed)");
      } catch {
        toast.error("Failed to delete content");
      }
    });
  };

  // Resolved UI (Read-Only)
  if (report.status !== "PENDING") {
    return (
      <Card className="flex items-center justify-between p-4 bg-[#1a110d]/50 border border-[#3e2723]/50 opacity-70">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-green-900 text-green-600">
             {report.status}
          </Badge>
          <span className="text-sm text-[#a1887f] line-clamp-1">
             {report.reason}
          </span>
        </div>
        <span className="text-xs text-[#5d4037]">
          {formatDistanceToNow(new Date(report.createdAt))} ago
        </span>
      </Card>
    );
  }

  // Active UI
  return (
    <Card className="group relative overflow-hidden bg-[#1a110d] border border-[#3e2723] p-5 transition-all hover:border-red-500/30">
      
      {/* Header: Reporter info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-[#3e2723]">
            <AvatarImage src={report.reporter.imageUrl} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#eaddcf]">
                {report.reporter.firstName}
              </span>
              <span className="text-xs text-[#a1887f]">reported a {isDiscussion ? "Scroll" : "Inscription"}</span>
            </div>
            <p className="text-xs text-[#5d4037]">
              {formatDistanceToNow(new Date(report.createdAt))} ago
            </p>
          </div>
        </div>
        
        {isDiscussion ? (
            <FileText size={18} className="text-[#d4af37]" />
        ) : (
            <MessageSquare size={18} className="text-blue-400" />
        )}
      </div>

      {/* The Accusation */}
      <div className="mb-4 rounded-lg bg-[#0f0b0a] border border-[#3e2723] p-3">
        <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 block">
           Reason
        </span>
        <p className="text-sm text-[#eaddcf] italic">
           &quot;{report.reason}&quot;
        </p>
      </div>

      {/* The Content Snippet */}
      <div className="mb-6 pl-4 border-l-2 border-[#3e2723]">
         <p className="text-xs text-[#a1887f] mb-1">Target Content:</p>
         {isDiscussion ? (
            <Link href={`/discussions/${report.discussion?.id}`} target="_blank" className="block group-hover/link:underline">
               <h4 className="text-sm font-bold text-[#d4af37] truncate flex items-center gap-2">
                 {report.discussion?.title}
                 <ExternalLink size={12} />
               </h4>
            </Link>
         ) : (
            <div>
               <p className="text-sm text-[#a1887f] line-clamp-2">
                 {report.comment?.content}
               </p>
               <Link href={`/discussions/${report.comment?.discussionId}`} target="_blank" className="text-[10px] text-[#5d4037] hover:text-[#d4af37] flex items-center gap-1 mt-1">
                 View Context <ExternalLink size={10} />
               </Link>
            </div>
         )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Dismiss Action */}
        <Button 
           variant="outline" 
           onClick={handleDismiss}
           disabled={isPending}
           className="border-[#3e2723] bg-[#0f0b0a] text-[#a1887f] hover:bg-[#3e2723]/30 hover:text-green-400"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <ShieldCheck size={16} className="mr-2" />}
          Dismiss
        </Button>
        
        {/* Delete Action with Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
               variant="destructive"
               disabled={isPending}
               className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} className="mr-2" />}
              Delete Content
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500 flex items-center gap-2">
                <Trash2 size={20} />
                Confirm Judgment
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#a1887f]">
                This action cannot be undone. This will permanently delete the 
                {isDiscussion ? " scroll" : " inscription"} and remove it from the dojo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeDelete}
                className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

    </Card>
  );
}