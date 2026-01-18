"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Check,
  X,
  Pencil,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  ScrollText,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getPlatform } from "@/lib/get-social";
import Image from "next/image";
import { toast } from "sonner";

interface SocialLink {
  id: string;
  platform: string;
  platformUrl: string;
}

interface Props {
  initialLinks?: SocialLink[];
  isOwnProfile?: boolean;
}

export default function SocialsManager({
  initialLinks, // REMOVED default value = [] to prevent infinite loop
  isOwnProfile = false,
}: Props) {
  const router = useRouter();
  
  // Safe fallback inside body
  const safeLinks = initialLinks || [];

  const [links, setLinks] = useState<SocialLink[]>(safeLinks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. SYNC & FETCH DATA ---
  
  // Fetch fresh data from DB (Only for Owner)
  const fetchSocials = useCallback(async () => {
    if (!isOwnProfile) return;

    try {
      const res = await fetch("/api/users/socials");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: SocialLink[] = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Failed to sync social links", error);
    }
  }, [isOwnProfile]);

  // Sync state when props change (Critical for visitors)
  useEffect(() => {
    if (initialLinks) {
      setLinks(initialLinks);
    }
  }, [initialLinks]);

  // Fetch fresh data on mount if owner (Critical for editing consistency)
  useEffect(() => {
    if (isOwnProfile) {
      fetchSocials();
    }
  }, [isOwnProfile, fetchSocials]);


  // --- CRUD OPERATIONS ---

  const handleCreate = async (url: string) => {
    if (!url.trim()) return setIsAdding(false);

    const info = getPlatform(url);
    const platformName = info?.type || "website";

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformName,
          platformUrl: url,
        }),
      });

      if (!res.ok) throw new Error("Failed to add link");

      toast.success("Connection added");
      setIsAdding(false);
      
      // Refresh local data & Server Components
      await fetchSocials(); 
      router.refresh(); 

    } catch (error) {
      console.error(error);
      toast.error("Could not add link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (index: number, newUrl: string) => {
    const linkToUpdate = links[index];

    if (!newUrl.trim()) {
      return handleDelete(index);
    }

    const info = getPlatform(newUrl);
    const platformName = info?.type || "website";

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/socials?id=${linkToUpdate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformName,
          platformUrl: newUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Connection updated");
      setEditingIndex(null);
      
      await fetchSocials();
      router.refresh();

    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const linkToDelete = links[index];
    const previousLinks = [...links];

    // Optimistic Update
    setLinks(links.filter((_, i) => i !== index));
    setEditingIndex(null);

    try {
      const res = await fetch(`/api/users/socials?id=${linkToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Connection removed");
      
      await fetchSocials();
      router.refresh();

    } catch (error) {
      setLinks(previousLinks); // Revert
      toast.error("Could not delete link");
    }
  };

  // --- VISITOR VIEW (Empty State) ---
  if (!isOwnProfile && links.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-xs font-bold text-[#a1887f] uppercase tracking-wider mb-3">
          Social Connections
        </h3>
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/30 text-center">
          <ScrollText className="w-8 h-8 text-[#5d4037] mb-2" />
          <p className="text-sm text-[#a1887f] italic">
            "This ninja walks a solitary path..."
          </p>
          <span className="text-[10px] text-[#5d4037] uppercase mt-1">
            No connections linked
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <h3 className="text-xs font-bold text-[#a1887f] uppercase tracking-wider mb-3">
        Social Connections
      </h3>

      <ScrollArea className="h-[280px] w-full rounded-xl border border-[#3e2723]/50 bg-[#0f0b0a]/20 p-2">
        <div className="space-y-2 pr-3">
          {/* --- LINKS LIST --- */}
          {links.map((link, index) => {
            if (isOwnProfile && editingIndex === index) {
              return (
                <SocialLinkEditor
                  key={link.id}
                  initialValue={link.platformUrl}
                  onSave={(val) => handleEdit(index, val)}
                  onCancel={() => setEditingIndex(null)}
                  onDelete={() => handleDelete(index)}
                  isLoading={isLoading}
                />
              );
            }

            return (
              <SocialLinkItem
                key={link.id}
                url={link.platformUrl}
                isOwnProfile={isOwnProfile}
                onEdit={() => setEditingIndex(index)}
              />
            );
          })}

          {/* --- ADD BUTTON (Owner Only) --- */}
          {isOwnProfile && (
            <>
              {isAdding ? (
                <SocialLinkEditor
                  initialValue=""
                  onSave={handleCreate}
                  onCancel={() => setIsAdding(false)}
                  isLoading={isLoading}
                />
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#3e2723] text-[#5d4037] hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#1a110d] transition-all duration-300 opacity-60 hover:opacity-100 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0f0b0a] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Add new connection</span>
                </button>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// --- SUB-COMPONENT: DISPLAY ITEM ---
function SocialLinkItem({
  url,
  isOwnProfile,
  onEdit,
}: {
  url: string;
  isOwnProfile: boolean;
  onEdit: () => void;
}) {
  const info = getPlatform(url);
  // Ensure valid URL for href
  const href = url.startsWith("http") ? url : `https://${url}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center justify-between p-2 rounded-xl bg-[#1a110d] border border-[#3e2723] transition-all cursor-pointer",
        isOwnProfile
          ? "hover:border-[#d4af37]/30" // Subtle hover for owner
          : "hover:border-[#d4af37] hover:bg-[#1a110d]/80" // Stronger hover for visitor
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Icon Box */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            info?.color
          )}
        >
          {info?.icon && (
            <Image
              src={info.icon}
              alt={info.type || "icon"}
              width={16}
              height={16}
              className="w-4 h-4"
            />
          )}
        </div>

        {/* Text Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#eaddcf] capitalize truncate flex items-center gap-2">
            {info?.type || "Link"}
            
            {/* Show external link icon for EVERYONE now, to indicate it's clickable */}
            <ExternalLink className="w-3 h-3 text-[#5d4037] opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </div>
      </div>

      {/* Edit Button (Owner Only) */}
      {isOwnProfile && (
        <button
          onClick={(e) => {
            // STOP PROPAGATION so the link doesn't open
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="mr-2 p-1.5 text-[#5d4037] hover:text-[#d4af37] hover:bg-[#3e2723]/30 rounded-lg transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-200 z-10"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </a>
  );
}

// --- SUB-COMPONENT: EDITOR ---
interface EditorProps {
  initialValue: string;
  onSave: (val: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

function SocialLinkEditor({
  initialValue,
  onSave,
  onCancel,
  onDelete,
  isLoading,
}: EditorProps) {
  const [value, setValue] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock click outside while loading to prevent accidental cancel
    if (isLoading) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isLoading) return;
    if (e.key === "Enter") onSave(value);
    if (e.key === "Escape") onCancel();
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 p-2 rounded-xl bg-[#0f0b0a] border border-[#d4af37] shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="relative flex-1">
        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5d4037]" />
        <Input
          autoFocus
          disabled={isLoading}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste URL..."
          className="h-9 pl-9 bg-[#1a110d] border-none text-xs text-[#eaddcf] placeholder:text-[#3e2723] focus-visible:ring-0 disabled:opacity-50"
        />
      </div>

      <div className="flex items-center gap-1 pr-1">
        <button
          onClick={() => onSave(value)}
          disabled={isLoading}
          className="p-1.5 bg-[#d4af37] text-[#0f0b0a] rounded-md hover:bg-[#b5952f] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="p-1.5 text-[#5d4037] hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="p-1.5 text-[#5d4037] hover:text-[#a1887f] hover:bg-[#3e2723]/30 rounded-md transition-colors disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}