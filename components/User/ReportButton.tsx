"use client";

import { useState } from "react";
import { Flag, AlertTriangle, Loader2, CheckCircle2, UserRoundXIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  targetUserId: string;
  targetUserName: string;
  variant?: "button" | "dropdown";
}

export default function ReportButton({ targetUserId, targetUserName, variant = "button" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState("");
  // State for the custom text input
  const [customText, setCustomText] = useState("");

  const [success, setSuccess] = useState(false);

  const reasons = [
    "Harassment or Toxicity (Rei)",
    "Spam or Self-Promotion (Meiyo)",
    "Plagiarism or Dishonesty (Makoto)",
    "Malware or Security Risk (Chuugi)",
    "Other Violation",
  ];

  const handleReport = async () => {
    // Determine the final reason string to send
    let finalReason = selectedCategory;

    // If "Other" is selected, we validate and use the custom text
    if (selectedCategory === "Other Violation") {
      if (!customText.trim()) {
        toast.error("Please describe the violation.");
        return;
      }
      finalReason = `Other: ${customText}`;
    } else {
      // If no category selected at all
      if (!selectedCategory) {
        toast.error("Please select a reason for the report.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedId: targetUserId, reason: finalReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit report.");
      }

      setSuccess(true);
      toast.success(data.message);

      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setSelectedCategory("");
        setCustomText("");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const Trigger = () => {
    if (variant === "dropdown") {
      return (
        <div className="flex items-center gap-2 w-full cursor-pointer text-[#a1887f] hover:text-red-400 transition-colors text-sm">
          <UserRoundXIcon size={14} />
          <span>Report User</span>
        </div>
      );
    }

    return (
      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a1887f] border border-[#3e2723] rounded hover:border-red-900 hover:bg-red-900/10 hover:text-red-400 transition-all group">
        <UserRoundXIcon size={14} className="group-hover:fill-current transition-colors" />
        Report User
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className="outline-none"
          onClick={(e) => {
            if (variant === "dropdown") e.stopPropagation();
          }}
        >
          <Trigger />
        </span>
      </DialogTrigger>

      <DialogContent className="bg-[#1a110d] border border-[#3e2723] text-[#eaddcf] max-w-md shadow-2xl">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-[#d4af37]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#d4af37]">Report Received</h3>
              <p className="text-sm text-[#a1887f] mt-1">
                Thank you for upholding the honor of the Dojo.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#d4af37]">
                <AlertTriangle size={20} className="text-red-500" />
                Report {targetUserName}
              </DialogTitle>
              <DialogDescription className="text-[#a1887f]">
                This report will be sent to the Dojo Admins for review.
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable container for reasons if list gets long */}
            <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {reasons.map((r) => (
                <div key={r} className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory(r)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200
                      ${
                        selectedCategory === r
                          ? "bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]"
                          : "bg-[#0f0b0a] border-[#3e2723] text-[#a1887f] hover:border-[#5d4037] hover:text-[#cfb096]"
                      }
                    `}
                  >
                    {r}
                  </button>

                  {/* Conditionally Render Text Area */}
                  {r === "Other Violation" && selectedCategory === "Other Violation" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 pl-4 border-l-2 border-[#d4af37]">
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Please describe the violation..."
                        className="w-full bg-[#0f0b0a] border border-[#3e2723] rounded-md p-3 text-sm text-[#eaddcf] placeholder:text-[#5d4037] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] min-h-20 resize-none"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-[#a1887f] hover:text-[#eaddcf] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={loading || !selectedCategory}
                className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-red-100 text-sm font-bold rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Submit Report
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
