"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ZoomIn, X, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommentAttachment({ attachment }: { attachment: Attachment }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = attachment.postUrl;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = url.split("/").pop() || "attachment";
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to open:", error);
      window.open(url, "_blank");
    }
  };

  const controlButtonClass =
    "h-12 w-12 rounded-full bg-[#1a110d]/80 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#1a110d] border border-[#3e2723] transition-colors backdrop-blur-sm shadow-lg";

  return (
    <>
      <div
        className="relative h-48 w-full sm:w-80 rounded-lg overflow-hidden border border-[#3e2723]/50 bg-[#0f0b0a] group cursor-zoom-in mt-2"
        onClick={() => setIsOpen(true)}
      >
        {attachment.type === "video" ? (
          <div className="w-full h-full relative flex items-center justify-center bg-black">
            <video
              src={attachment.postUrl}
              className="w-full h-full object-cover pointer-events-none opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/90 flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                <Play size={18} className="text-[#1a110d] fill-[#1a110d]" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <Image
              src={attachment.postUrl}
              alt="Attachment"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="text-white drop-shadow-md w-8 h-8" />
            </div>
          </>
        )}
      </div>
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex flex-col bg-[#0f0b0a]/95 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 z-10000 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={controlButtonClass}
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={controlButtonClass}
                onClick={handleDownload}
              >
                <Download size={24} />
              </Button>
            </div>
            <div
              className="flex-1 overflow-y-auto w-full h-full custom-scrollbar flex flex-col p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
              }}
            >
              {attachment.type === "video" ? (
                <video
                  src={attachment.postUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl my-auto mx-auto border border-[#3e2723]"
                />
              ) : (
                <img
                  src={attachment.postUrl}
                  alt="Full view"
                  className="w-auto h-auto max-w-[95vw] object-contain shadow-2xl my-auto mx-auto border border-[#3e2723]"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}