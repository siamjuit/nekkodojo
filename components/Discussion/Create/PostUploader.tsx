"use client";

import { useEffect, useRef, useState } from "react";
import { ImageKitAbortError, upload } from "@imagekit/next";
import { toast } from "sonner";
import { FileVideo, ImageIcon, Loader2 } from "lucide-react";

export interface UploadFile {
  postUrl: string;
  type: "image" | "video";
  id: string;
  name: string;
}

interface Props {
  onUploadSuccess: (files: UploadFile[]) => void;
  acceptType: "image" | "video";
  maxFiles?: number;
}

const PostUploader = ({ onUploadSuccess, acceptType, maxFiles = 4 }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const err = await response.text();
        console.error(err);
        throw new Error("Request failed!");
      }
      const data = await response.json();
      const { expire, token, signature, publicKey } = data;
      return { expire, token, signature, publicKey };
    } catch (error: any) {
      console.error(error);
      throw new Error("Authentication request failed!");
    }
  };

  const handleSubmit = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const files = Array.from(fileInput.files);

    if (files.length > maxFiles) {
      toast.error(`Maximum of ${maxFiles} files can be uploaded at a time.`);
      fileInput.value = "";
      return;
    }

    const invalidFiles = files.filter((file) => !file.type.startsWith(`${acceptType}/`));

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files selected. Only ${acceptType} are allowed here.`);
      fileInput.value = "";
      return;
    }
    setUploading(true);
    setProgress({});

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const authParams = await authenticator();

      const uploadPromises = files.map(async (file) => {
        try {
          const response = await upload({
            file,
            fileName: file.name,
            useUniqueFileName: true,
            tags: ["forum-post", acceptType],
            expire: authParams.expire,
            token: authParams.token,
            signature: authParams.signature,
            publicKey: authParams.publicKey,
            abortSignal: abortController.signal,
            onProgress: (event) => {
              setProgress((prev) => ({
                ...prev,
                [file.name]: (event.loaded / event.total) * 100,
              }));
            },
          });

          return {
            postUrl: response.url,
            id: response.fileId,
            type: acceptType,
            name: response.name,
          } as UploadFile;
        } catch (error) {
          if (error instanceof ImageKitAbortError) {
            toast.info("Upload cancelled");
            return null;
          }
          console.error("Error uploading", file.name, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successUploads = results.filter((result): result is UploadFile => result !== null);

      if (successUploads.length > 0) {
        onUploadSuccess(successUploads);
        toast.success(`Added ${successUploads.length} files`);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.info("Upload cancelled");
      } else {
        console.error("Upload failed:", err);
        toast.error("Failed to start upload.");
      }
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const progressValues = Object.values(progress);
  const totalProgress =
    progressValues.length > 0
      ? progressValues.reduce((a, b) => a + b, 0) / progressValues.length
      : 0;

  return (
    <>
      <div className="w-full">
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border border-dashed rounded-lg p-6 transition-all group cursor-pointer flex flex-col items-center justify-center gap-2 h-36
          ${uploading ? "border-[#d4af37] bg-[#d4af37]/5 cursor-default" : "border-[#3e2723] bg-[#0f0b0a]/30 hover:bg-[#1a110d] hover:border-[#d4af37]/50"}
        `}
        >
          <input
            type="file"
            multiple
            accept={`${acceptType}/*`}
            className="hidden"
            ref={fileInputRef}
            onChange={handleSubmit}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center w-full max-w-[80%] gap-3 z-10">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-xs font-medium animate-pulse">
                  Uploading... {Math.round(totalProgress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#1a110d] rounded-full overflow-hidden border border-[#3e2723]">
                <div
                  className="h-full bg-[#d4af37] transition-all duration-300 ease-out"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelUpload();
                }}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {acceptType === "image" ? (
                <ImageIcon className="size-8 text-[#5d4037] group-hover:text-[#d4af37] transition-colors" />
              ) : (
                <FileVideo className="size-8 text-[#5d4037] group-hover:text-[#d4af37] transition-colors" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-[#eaddcf] group-hover:text-[#d4af37] transition-colors capitalize">
                  Add {acceptType}s
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PostUploader;
