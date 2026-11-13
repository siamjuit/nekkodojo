"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnsoCat, Grain, Paw, SleepingCat } from "@/components/Landing Page/DojoGraphics";

import { CreateTagDialog } from "./CreateDialog";
import { EditTagDialog } from "./EditDialog";
import { DeleteTagDialog } from "./DeleteDialog";

type SortKey = "name" | "popular" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "popular", label: "Most used" },
  { key: "recent", label: "Recent" },
];

export default function TagClient() {
  const [data, setData] = useState<TagData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagData | null>(null);
  const [tagToEdit, setTagToEdit] = useState<TagData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTags = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/discussions/tag");
        if (!response.ok) throw new Error("Failed to fetch tags.");
        const tags = (await response.json()) as TagData[];
        if (!cancelled) setData(tags);
      } catch (fetchError) {
        console.error("Failed to load discussion tags:", fetchError);
        if (!cancelled) setError("Unable to load discussion tags.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadTags();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredTags = useMemo(() => {
    const list = data.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return [...list].sort((a, b) => {
      if (sort === "popular") return b._count.discussions - a._count.discussions;
      if (sort === "recent")
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.name.localeCompare(b.name);
    });
  }, [data, searchTerm, sort]);

  const totalDiscussions = data.reduce((sum, t) => sum + t._count.discussions, 0);
  const topTag = data.reduce<TagData | null>(
    (best, t) => (!best || t._count.discussions > best._count.discussions ? t : best),
    null
  );

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center gap-3 py-10 text-[#d4af37]">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span>Loading tags...</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-md border border-[#3a2318] bg-[#2b1a12]/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center space-y-5 py-16 text-center">
        <EnsoCat className="size-24 opacity-60" />
        <p role="alert" className="text-red-400">
          {error}
        </p>
        <Button
          onClick={() => setRetryCount((count) => count + 1)}
          variant="outline"
          className="border-[#5c3d21] text-[#eaddcf] hover:border-[#d4af37] hover:bg-[#2b1a12] hover:text-[#d4af37]"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="relative flex flex-col items-start justify-between gap-5 border-b border-[#5c3d21] pb-7 sm:flex-row sm:items-end">
        <div>
          <span className="font-serif text-sm tracking-[0.5em] text-[#d4af37]/80">札</span>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide text-[#eaddcf] md:text-4xl">
            Discussion <span className="text-[#d4af37]">Tags</span>
          </h1>
          <p className="mt-2 text-sm text-[#a1887f]">
            Manage tags used to categorize community discussions.
          </p>
        </div>

        <div className="flex items-end gap-6">
          <SleepingCat className="hidden w-28 opacity-70 md:block" />
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#d4af37] font-semibold text-[#1a110d] hover:bg-[#c5a028]"
          >
            <Plus className="mr-2 size-4" />
            Add Tag
          </Button>
        </div>
      </header>

      <section aria-label="Tag summary" className="grid gap-3 sm:grid-cols-3">
        <StatTile watermark="札" label="Tags">
          <span className="font-serif text-3xl font-semibold tabular-nums text-[#eaddcf]">
            {data.length}
          </span>
        </StatTile>
        <StatTile watermark="話" label="Tagged discussions">
          <span className="font-serif text-3xl font-semibold tabular-nums text-[#eaddcf]">
            {totalDiscussions}
          </span>
        </StatTile>
        <StatTile watermark="一" label="Most used">
          {topTag && topTag._count.discussions > 0 ? (
            <Badge
              className={`mt-1 whitespace-nowrap rounded border px-2 py-0.5 text-xs hover:bg-transparent ${topTag.color}`}
            >
              {topTag.name}
            </Badge>
          ) : (
            <span className="text-[#5d4037]">None yet</span>
          )}
        </StatTile>
      </section>

      {/* ---------- Search and sort ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5d4037]" />
          <Input
            placeholder="Search tags..."
            aria-label="Search tags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 border-[#5c3d21] bg-[#18120e] pl-10 text-[#eaddcf] shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)] placeholder:text-[#5d4037] focus-visible:border-[#d4af37] focus-visible:ring-1 focus-visible:ring-[#d4af37]/50"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs tabular-nums text-[#8d6e63]">
            Showing {filteredTags.length} of {data.length}
          </span>
          <div
            role="group"
            aria-label="Sort tags"
            className="flex rounded-md border border-[#5c3d21] bg-[#18120e] p-1"
          >
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  sort === s.key
                    ? "bg-[#d4af37] text-[#1a110d]"
                    : "text-[#a1887f] hover:text-[#d4af37]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Tag plates ---------- */}
      {filteredTags.length === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-dashed border-[#5c3d21] py-16 text-center">
          <EnsoCat className="size-20 opacity-50" />
          <p className="mt-4 font-serif text-lg text-[#eaddcf]/90">
            {data.length === 0
              ? "The tag rack is empty."
              : `No tags found matching "${searchTerm}"`}
          </p>
          {data.length === 0 && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              className="mt-5 border-[#5c3d21] text-[#d4af37] hover:border-[#d4af37] hover:bg-[#2b1a12]"
            >
              <Plus className="mr-2 size-4" /> Add the first tag
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTags.map((tag) => (
            <li key={tag.id}>
              <article className="group relative h-full overflow-hidden rounded-md border border-[#5c3d21] bg-[#2b1a12] pb-4 pt-9 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-[0_18px_30px_-18px_rgba(0,0,0,0.9)]">
                <Grain variant="hinoki" strength={0.8} />

                {/* cord hole, like a tag hung on a rack */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-3 size-3 -translate-x-1/2 rounded-full border border-[#5c3d21] bg-[#120d0a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                />
                {/* gold line drawn from the centre of the top edge */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px origin-center scale-x-0 bg-[#d4af37] transition-transform duration-500 group-hover:scale-x-100"
                />

                <div className="relative px-5">
                  {/* the tag as members see it */}
                  <div className="flex min-h-10 items-center justify-center rounded-sm border border-[#3a2318] bg-[#18120e]/70 px-3 py-4">
                    <Badge
                      className={`whitespace-nowrap rounded border px-3 py-1 text-xs hover:bg-transparent ${tag.color}`}
                    >
                      {tag.name}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h2 className="truncate font-semibold text-[#eaddcf]">{tag.name}</h2>
                    <span className="shrink-0 font-mono text-xs text-[#8d6e63]">/{tag.slug}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#3a2318] pt-3">
                    <div className="flex items-center gap-2 text-sm text-[#a1887f]">
                      <Paw className="size-4 text-[#d4af37]/70 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                      <span className="tabular-nums text-[#eaddcf]">{tag._count.discussions}</span>
                      <span className="text-xs text-[#8d6e63]">
                        {tag._count.discussions === 1 ? "discussion" : "discussions"}
                      </span>
                    </div>
                    <time className="text-xs tabular-nums text-[#5d4037]">
                      {format(new Date(tag.updatedAt), "MMM d, yyyy")}
                    </time>
                  </div>

                  {/* actions: always visible on touch, revealed on hover for desktop */}
                  <div className="mt-3 flex items-center justify-end gap-1 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setTagToEdit(tag)}
                      aria-label={`Edit ${tag.name}`}
                      className="size-11 text-[#a1887f] hover:bg-[#3a2318] hover:text-[#d4af37] md:size-8"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setTagToDelete(tag)}
                      aria-label={`Delete ${tag.name}`}
                      className="size-11 text-[#a1887f] hover:bg-red-900/20 hover:text-red-400 md:size-8"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {/* ---------- Dialogs ---------- */}
      <CreateTagDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => setRetryCount((count) => count + 1)}
      />

      <EditTagDialog
        open={!!tagToEdit}
        onOpenChange={(open) => !open && setTagToEdit(null)}
        tag={tagToEdit}
        onSuccess={() => {
          setTagToEdit(null);
          setRetryCount((count) => count + 1);
        }}
      />

      <DeleteTagDialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
        tag={tagToDelete}
        onSuccess={() => {
          setTagToDelete(null);
          setRetryCount((count) => count + 1);
        }}
      />
    </div>
  );
}

/* A small summary tile with a faint kanji behind it */
function StatTile({
  watermark,
  label,
  children,
}: {
  watermark: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-[#5c3d21] bg-[#18120e] px-5 py-4">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 -top-3 select-none font-serif text-7xl leading-none text-[#d4af37]/[0.07]"
      >
        {watermark}
      </span>
      <p className="relative text-xs text-[#8d6e63]">{label}</p>
      <div className="relative mt-1">{children}</div>
    </div>
  );
}
