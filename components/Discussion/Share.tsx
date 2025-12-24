"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  Link as LinkIcon,
  Check,
  Copy,
} from "lucide-react";
import {
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Share() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const title = "Check out this discussion on Nekodojo!";

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const socialBtnClass =
    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#1a110d] border border-[#3e2723] text-[#a1887f] hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300 w-full h-24 group";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-[#a1887f] hover:text-[#d4af37] text-sm transition-colors focus:outline-none group">
          <Share2 size={16} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0f0b0a]/95 backdrop-blur-xl border border-[#3e2723] text-[#eaddcf] sm:max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#d4af37] font-bold text-xl text-center pb-2">
            Share Scroll
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2 bg-[#1a110d] p-1.5 rounded-lg border border-[#3e2723]">
          <div className="p-2 text-[#5d4037]">
            <LinkIcon size={16} />
          </div>
          <Input
            value={url}
            readOnly
            className="border-none bg-transparent h-9 text-xs text-[#a1887f] focus-visible:ring-0 px-0"
          />
          <Button
            size="sm"
            onClick={handleCopyLink}
            className={`h-8 px-4 transition-all duration-300 ${
              copied
                ? "bg-green-900/20 text-green-500 hover:bg-green-900/30"
                : "bg-[#3e2723]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a110d]"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <TwitterShareButton url={url} title={title} className="w-full">
            <div className={socialBtnClass}>
              <Image src={"/logos/twitter.svg"} alt="twitter" width={32} height={32} />
              <span className="text-xs font-mono uppercase tracking-wider">Twitter</span>
            </div>
          </TwitterShareButton>

          <LinkedinShareButton
            url={url}
            title={title}
            summary="A great discussion on Algorithms."
            source="Nekodojo"
            className="w-full"
          >
            <div className={socialBtnClass}>
              <Image src={"/logos/linkedIn.svg"} alt="linkedIn" width={32} height={32} />
              <span className="text-xs font-mono uppercase tracking-wider">LinkedIn</span>
            </div>
          </LinkedinShareButton>

          <RedditShareButton url={url} title={title} className="w-full">
            <div className={socialBtnClass}>
              <Image src={"/logos/reddit.svg"} alt="reddit" width={32} height={32} />
              <span className="text-xs font-mono uppercase tracking-wider">Reddit</span>
            </div>
          </RedditShareButton>

          <WhatsappShareButton url={url} title={title} separator=" - " className="w-full">
            <div className={socialBtnClass}>
              <Image src={"/logos/whatsapp.svg"} alt="whatsapp" width={32} height={32} />
              <span className="text-xs font-mono uppercase tracking-wider">WhatsApp</span>
            </div>
          </WhatsappShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
