"use client";

import { ImageKitAbortError, upload } from "@imagekit/next";
import { Image as ImageIcon, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  currentLogoUrl: string | null;
  onUploadSuccess: (res: { url: string; fileId: string }) => void;
  onRemove: () => void;
}

export function LogoUploader({ currentLogoUrl, onUploadSuccess, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 1. Authenticator (Same as your comment uploader)
  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) throw new Error(`Auth failed: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Authenticator Error:", error);
      throw new Error("Authentication request failed!");
    }
  };

  // 2. File Change Handler
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validation
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only images allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File too large. Max size is 5MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setProgress(0);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const authParams = await authenticator();

      const response = await upload({
        file,
        fileName: file.name,
        useUniqueFileName: true,
        tags: ["company-logo"], // Specific tag for logos
        expire: authParams.expire,
        token: authParams.token,
        signature: authParams.signature,
        publicKey: authParams.publicKey,
        abortSignal: abortController.signal,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      if (response) {
        onUploadSuccess({
          url: response.url!,
          fileId: response.fileId!,
        });
        toast.success("Logo uploaded");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      if (err.name === "AbortError" || err instanceof ImageKitAbortError) {
        toast.info("Upload cancelled");
      } else {
        toast.error("Failed to upload logo.");
      }
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const cancelUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="w-full">
      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
        disabled={uploading}
      />

      {/* --- UI STATES --- */}

      {/* 1. UPLOADING STATE */}
      {uploading ? (
        <div className="border border-[#d4af37]/30 bg-[#d4af37]/5 rounded-lg h-32 w-full flex flex-col items-center justify-center gap-2 relative">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
          <span className="text-sm font-medium text-[#d4af37] animate-pulse">
            Uploading... {Math.round(progress)}%
          </span>
          <button
            onClick={cancelUpload}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-[#d4af37]/20 text-[#d4af37] transition-colors"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      ) : currentLogoUrl ? (
        // 2. PREVIEW STATE (Logo Exists)
        <div className="relative h-32 w-full border border-[#3e2723] rounded-lg bg-[#0f0b0a] overflow-hidden group">
          <Image src={currentLogoUrl} alt="Logo Preview" fill className="object-contain p-4" />

          {/* Remove Button Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onRemove}
              type="button"
              className="bg-red-900/80 text-red-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-800 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Trash2 size={16} />
              Remove Logo
            </button>
          </div>
        </div>
      ) : (
        // 3. IDLE STATE (Upload Trigger)
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-[#3e2723] rounded-lg h-32 w-full flex flex-col items-center justify-center gap-3 bg-[#0f0b0a]/30 transition-all cursor-pointer hover:bg-[#3e2723]/20 hover:border-[#d4af37]/50 group"
        >
          <div className="p-3 rounded-full bg-[#1a110d] border border-[#3e2723] group-hover:border-[#d4af37]/50 transition-colors">
            <UploadCloud className="w-6 h-6 text-[#5d4037] group-hover:text-[#d4af37]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#eaddcf] group-hover:text-[#d4af37]">
              Click to upload logo
            </p>
            <p className="text-[10px] text-[#5d4037]">SVG, PNG, JPG (Max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
}
