"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, FileVideo, PenLine, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/Discussion/Create/TextEditor";
import ImageKitUploader, { UploadFile } from "@/components/Discussion/Create/PostUploader";
import { useUser } from "@clerk/nextjs";
import { TagSelector } from "@/components/Discussion/Create/Tags";
import attFromKit from "@/lib/actions/removeAtt";

export default function CreateDiscussionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  if (!user) return;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<UploadFile[]>([]);
  const [tag, setTag] = useState<TagProps>({
    name: "General Discussion",
    slug: "discussion",
    color: "bg-[#2a110c] text-[#a1887f] border-[#3e2723]",
  });

  const MAX_FILES = 4;
  const remainingSlots = MAX_FILES - attachments.length;

  const handleUploadSuccess = (newFiles: UploadFile[]) => {
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    attFromKit(attachments[indexToRemove].id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error("Title must be at least 5 characters long.");
      return;
    }
    if (!description.trim() || description.length < 20) {
      toast.error("Description is too short. Elaborate on your topic.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/discussions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          authorId: user.id,
          tag,
          attachments: attachments.map((att) => ({
            id: att.id,
            postUrl: att.postUrl,
            type: att.type,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      toast.success("Discussion created successfully!");

      router.push(`/discussions/${data}`, { scroll: true });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0b0a] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-2 border-b border-[#3e2723] pb-6">
          <h1 className="text-3xl font-bold text-[#d4af37] flex items-center gap-3 tracking-tight">
            <PenLine className="size-8" />
            Start a Discussion
          </h1>
          <p className="text-[#a1887f] max-w-2xl">
            Share your knowledge, ask questions, or showcase your projects to the Dojo. Remember to
            follow the{" "}
            <span className="text-[#d4af37] underline cursor-pointer">Code of Bushido</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start">
            {/* LEFT SIDE: Title (Takes up 3/4 of the space) */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="title"
                  className="text-[#d4af37] uppercase text-xs tracking-widest font-bold"
                >
                  Title
                </Label>
                <span
                  className={`text-xs ${title.length > 80 ? "text-red-400" : "text-[#5d4037]"}`}
                >
                  {title.length} / 100
                </span>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to implement Recursive Comments in Next.js?"
                className="h-14 bg-[#1a110d]/50 border-[#3e2723] text-lg text-[#eaddcf] placeholder:text-[#5d4037] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all rounded-xl"
                maxLength={100}
              />
            </div>
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center h-4">
                <Label className="text-[#d4af37] uppercase text-xs tracking-widest font-bold">
                  Category
                </Label>
              </div>
              <div className="h-14">
                <TagSelector value={tag} onChange={setTag} />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <RichTextEditor
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Provide details, code snippets, or context..."
            />
          </div>
          <div className="space-y-4 pt-4 border-t border-[#3e2723]/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-[#d4af37] uppercase text-xs tracking-widest font-bold flex items-center gap-2">
                  <Sparkles size={14} /> Attachments
                </Label>
                <p className="text-xs text-[#a1887f]">Images or Videos to support your post.</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#1a110d] border border-[#3e2723] text-xs font-mono text-[#d4af37]">
                {attachments.length} / {MAX_FILES} Used
              </div>
            </div>

            {remainingSlots > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageKitUploader
                  acceptType="image"
                  maxFiles={remainingSlots}
                  onUploadSuccess={handleUploadSuccess}
                />
                <ImageKitUploader
                  acceptType="video"
                  maxFiles={remainingSlots}
                  onUploadSuccess={handleUploadSuccess}
                />
              </div>
            ) : (
              <div className="p-4 bg-[#1a110d] border border-[#d4af37]/30 rounded-xl text-center">
                <p className="text-sm text-[#d4af37] font-medium">Maximum limit allowed reached.</p>
              </div>
            )}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-[#3e2723]"
                  >
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 backdrop-blur-sm"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                    {file.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#1a110d]">
                        <FileVideo className="size-8 text-[#d4af37] opacity-80" />
                        <video
                          src={file.postUrl}
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                          muted
                          onMouseOver={(event) => (event.target as HTMLVideoElement).play()}
                          onMouseOut={(event) => (event.target as HTMLVideoElement).pause()}
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/80 text-[#d4af37] px-1.5 rounded font-bold uppercase tracking-wider">
                          Video
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={file.postUrl}
                          alt="Attachment"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/80 text-[#d4af37] px-1.5 rounded font-bold uppercase tracking-wider">
                          Image
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#3e2723]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-[#a1887f] hover:text-[#d4af37] hover:bg-transparent uppercase tracking-wider text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#d4af37] cursor-pointer text-[#1a110d] font-bold px-8 py-6 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:bg-[#c5a028] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Publishing...
                </>
              ) : (
                "Post to Dojo"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
