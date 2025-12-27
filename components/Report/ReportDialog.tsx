"use client";

import { useState, useTransition } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Flag, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ReportDialogProps {
  trigger?: React.ReactNode; 
  contentId: string;         
  type: "discussion" | "comment"; 
}

export function ReportDialog({ trigger, contentId, type }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  // Thematic labels and API endpoints
  const label = type === "discussion" ? "Scroll" : "Inscription";
  const apiEndpoint = type === "discussion" 
    ? `/api/discussions/${contentId}/report` 
    : `/api/comments/${contentId}/report`;

  const predefinedReasons = [
    "Spam or misleading",
    "Harassment or hate speech",
    "Inappropriate content",
    "Off-topic / Disturbance",
    "Other"
  ];

  const handleNext = () => {
    if (!reason) return;
    if (reason === "Other" && !customReason.trim()) {
      toast.error("Please specify a reason.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (confirmText.toUpperCase() !== "REPORT") {
      toast.error("Please type REPORT to confirm.");
      return;
    }

    const finalReason = reason === "Other" ? customReason : reason;

    startTransition(async () => {
      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          body: JSON.stringify({ reason: finalReason }),
        });

        if (res.status === 409) {
          toast.warning(`You have already reported this ${label}.`);
          setOpen(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to report");

        toast.success(`${label} reported to the Tribunal.`);
        setOpen(false);
        // Reset state after closing
        setTimeout(() => {
          setStep(1);
          setReason("");
          setCustomReason("");
          setConfirmText("");
        }, 300);
        
      } catch (error) {
        toast.error("Failed to submit report.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          // Default trigger if none provided (e.g. for standalone buttons)
          <Button variant="ghost" size="sm" className="gap-2 text-red-400 hover:text-red-500">
             <Flag size={16} /> Report
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] sm:max-w-md">
        
        {/* --- STEP 1: SELECT REASON --- */}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[#d4af37] flex items-center gap-2">
                <Flag size={20} />
                Report {label}
              </DialogTitle>
              <DialogDescription className="text-[#a1887f]">
                Help the guardians maintain balance. Why are you flagging this?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
                {predefinedReasons.map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={r} 
                      id={r} 
                      className="border-[#5d4037] text-[#d4af37] focus:border-[#d4af37]"
                    />
                    <Label htmlFor={r} className="text-[#eaddcf] cursor-pointer font-normal">
                      {r}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {reason === "Other" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <Textarea
                    placeholder="Please describe the disturbance..."
                    className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] min-h-20"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                onClick={handleNext} 
                disabled={!reason || (reason === "Other" && !customReason.trim())}
                className="bg-[#3e2723] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a110d]"
              >
                Next Step
              </Button>
            </DialogFooter>
          </>
        )}

        {/* --- STEP 2: CONFIRMATION --- */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle size={20} />
                Confirm Report
              </DialogTitle>
              <DialogDescription className="text-[#a1887f]">
                This will alert the Tribunal. False reports may dishonor your standing.
                <br /><br />
                Type <span className="font-bold text-red-500">REPORT</span> below to confirm.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
               <Input 
                 value={confirmText}
                 onChange={(e) => setConfirmText(e.target.value)}
                 placeholder="REPORT"
                 className="bg-[#0f0b0a] border-[#3e2723] text-red-400 placeholder:text-[#5d4037] font-mono tracking-widest text-center uppercase"
               />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
               <Button 
                 variant="ghost" 
                 onClick={() => setStep(1)}
                 className="text-[#a1887f] hover:text-[#eaddcf]"
               >
                 Back
               </Button>
               <Button 
                 onClick={handleSubmit}
                 disabled={confirmText.toUpperCase() !== "REPORT" || isPending}
                 className="bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-900/50"
               >
                 {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                 Submit Report
               </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}