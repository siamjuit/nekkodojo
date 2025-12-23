"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ZoomIn, X, Download } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Attachment {
  id: string;
  postUrl: string;
  type: string;
}

export function AttachmentCarousel({ attachments }: { attachments: Attachment[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<Attachment | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedFile(null);
    };
    if (selectedFile) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedFile]);

  const handleDownload = async (url: string) => {
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

  if (!attachments || attachments.length === 0) return null;

  const controlButtonClass =
    "h-12 w-12 rounded-full bg-[#1a110d]/80 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#1a110d] border border-[#3e2723] transition-colors backdrop-blur-sm shadow-lg";

  return (
    <>
      <div className="w-full flex flex-col items-center gap-2 mt-6">
        <Carousel setApi={setApi} className="w-full max-w-xl relative" opts={{ loop: true }}>
          <CarouselContent>
            {attachments.map((file) => (
              <CarouselItem key={file.id}>
                <div className="p-1">
                  <Card
                    className="bg-[#0f0b0a] border border-[#3e2723] shadow-lg rounded-xl overflow-hidden cursor-zoom-in group transition-colors hover:border-[#d4af37]/50"
                    onClick={() => setSelectedFile(file)}
                  >
                    <CardContent className="p-0 relative bg-black/40">
                      <AspectRatio ratio={1 / 1}>
                        {file.type === "video" ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            <video
                              src={file.postUrl}
                              className="w-full h-full object-contain pointer-events-none"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                              <div className="w-12 h-12 rounded-full bg-[#d4af37]/80 flex items-center justify-center pl-1">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-[#1a110d] border-b-8 border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              src={file.postUrl}
                              alt="Attachment"
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <ZoomIn className="text-white drop-shadow-md w-8 h-8" />
                            </div>
                          </div>
                        )}
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {count > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-[#1a110d]/80 border-[#3e2723] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a110d] z-10" />
              <CarouselNext className="right-2 bg-[#1a110d]/80 border-[#3e2723] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a110d] z-10" />
            </>
          )}
        </Carousel>

        {count > 1 && (
          <div className="text-[10px] uppercase tracking-widest text-[#5d4037] font-mono">
            Attachment {current} / {count}
          </div>
        )}
      </div>
      {mounted &&
        selectedFile &&
        createPortal(
          <div className="fixed inset-0 z-9997 flex flex-col bg-[#0f0b0a]/95 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 z-9998 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={controlButtonClass}
                onClick={() => setSelectedFile(null)}
              >
                <X size={24} />
              </Button>
              <span className="text-sm text-center">
                Attachment {current} / {count}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className={controlButtonClass}
                onClick={() => handleDownload(selectedFile.postUrl)}
              >
                <Download size={24} />
              </Button>
            </div>
            <div
              className="flex-1 overflow-y-auto w-full h-full custom-scrollbar flex flex-col p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedFile(null);
              }}
            >
              {selectedFile.type === "video" ? (
                <video
                  src={selectedFile.postUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl my-auto mx-auto"
                />
              ) : (
                <img
                  src={selectedFile.postUrl}
                  alt="Full view"
                  className="w-auto h-auto max-w-[95vw] object-contain shadow-2xl my-auto mx-auto"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
