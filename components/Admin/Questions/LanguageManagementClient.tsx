"use client";

import { useEffect, useState } from "react";
import { Code2, Loader2, Pencil, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EnsoCat, Grain, SleepingCat } from "@/components/Landing Page/DojoGraphics";

type Language = {
  id: string;
  name: string;
  slug: string;
  monacoSlug: string;
  extension: string;
  dockerImage: string;
  compileCmd: string | null;
  runCmd: string;
  isSupported: boolean;
};

type LanguagePayload = Omit<Language, "id">;
type Filter = "all" | "supported" | "disabled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "supported", label: "Supported" },
  { key: "disabled", label: "Disabled" },
];

const inputClass =
  "border-[#5c3d21] bg-[#120d0a] text-[#eaddcf] shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)] placeholder:text-[#5d4037] focus-visible:border-[#d4af37] focus-visible:ring-1 focus-visible:ring-[#d4af37]/50";
const terminalClass =
  "border-[#3a2318] bg-[#0b0807] font-mono text-sm text-[#eaddcf] placeholder:text-[#5d4037] focus-visible:border-[#d4af37] focus-visible:ring-1 focus-visible:ring-[#d4af37]/50";
const labelClass = "text-sm font-medium text-[#a1887f]";

export default function LanguageManagementClient() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [languageToEdit, setLanguageToEdit] = useState<Language | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLanguages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/language");
        if (!response.ok) throw new Error("Failed to fetch languages.");
        const data = (await response.json()) as Language[];
        if (!cancelled) setLanguages(data);
      } catch (fetchError) {
        console.error("Failed to load languages:", fetchError);
        if (!cancelled) setError("Unable to load languages.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadLanguages();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredLanguages = languages.filter((language) => {
    const matchesSearch = `${language.name} ${language.slug} ${language.monacoSlug}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "supported" ? language.isSupported : !language.isSupported);
    return matchesSearch && matchesFilter;
  });

  const supportedCount = languages.filter((l) => l.isSupported).length;

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center gap-3 py-10 text-[#d4af37]">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span>Loading languages...</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-md border border-[#3a2318] bg-[#2b1a12]/50"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
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
      {/* ---------- Header ---------- */}
      <header className="flex flex-col items-start justify-between gap-5 border-b border-[#5c3d21] pb-7 sm:flex-row sm:items-end">
        <div>
          <span className="font-serif text-sm tracking-[0.5em] text-[#d4af37]/80">言語</span>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide text-[#eaddcf] md:text-4xl">
            <span className="text-[#d4af37]">Languages</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#a1887f]">
            Manage programming languages available to question code stubs and the editor.
          </p>
        </div>
        <div className="flex items-end gap-6">
          <SleepingCat className="hidden w-28 opacity-70 md:block" />
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer bg-[#d4af37] font-semibold text-[#1a110d] hover:bg-[#c5a028]"
          >
            <Plus className="mr-2 size-4" />
            Add Language
          </Button>
        </div>
      </header>

      {/* ---------- Stats ---------- */}
      <section aria-label="Language summary" className="grid gap-3 sm:grid-cols-3">
        <StatTile watermark="言" label="Languages" value={languages.length} />
        <StatTile watermark="灯" label="Supported" value={supportedCount} />
        <StatTile watermark="休" label="Disabled" value={languages.length - supportedCount} />
      </section>

      {/* ---------- Search and filter ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5d4037]" />
          <Input
            placeholder="Search languages..."
            aria-label="Search languages"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={`h-11 pl-10 ${inputClass}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs tabular-nums text-[#8d6e63]">
            Showing {filteredLanguages.length} of {languages.length}
          </span>
          <div
            role="group"
            aria-label="Filter languages"
            className="flex rounded-md border border-[#5c3d21] bg-[#18120e] p-1"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                  filter === f.key
                    ? "bg-[#d4af37] text-[#1a110d]"
                    : "text-[#a1887f] hover:text-[#d4af37]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Language cards ---------- */}
      {filteredLanguages.length === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-dashed border-[#5c3d21] py-16 text-center">
          <EnsoCat className="size-20 opacity-50" />
          <p className="mt-4 font-serif text-lg text-[#eaddcf]/90">
            {languages.length === 0
              ? "No languages have been taught here yet."
              : `No languages found matching "${searchTerm}"`}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredLanguages.map((language) => (
            <li key={language.id}>
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-md border bg-[#2b1a12] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-[0_18px_30px_-18px_rgba(0,0,0,0.9)]",
                  language.isSupported ? "border-[#5c3d21]" : "border-[#3a2318]"
                )}
              >
                <Grain variant="hinoki" strength={0.7} />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px origin-center scale-x-0 bg-[#d4af37] transition-transform duration-500 group-hover:scale-x-100"
                />

                <div
                  className={cn(
                    "relative flex flex-1 flex-col",
                    !language.isSupported && "opacity-80"
                  )}
                >
                  {/* name */}
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[3px] border border-[#5c3d21] bg-[#120d0a] text-[#d4af37]">
                      <Code2 className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-xl font-semibold text-[#eaddcf]">
                        {language.name}
                      </h2>
                      <p className="font-mono text-xs text-[#8d6e63]">.{language.extension}</p>
                    </div>
                  </div>

                  {/* identifiers */}
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
                    <span className="rounded-sm border border-[#3a2318] bg-[#18120e] px-2 py-1 text-[#a1887f]">
                      <span className="text-[#5d4037]">slug </span>
                      {language.slug}
                    </span>
                    <span className="rounded-sm border border-[#3a2318] bg-[#18120e] px-2 py-1 text-[#a1887f]">
                      <span className="text-[#5d4037]">monaco </span>
                      {language.monacoSlug}
                    </span>
                  </div>

                  {/* runtime, laid out like a terminal */}
                  <dl className="mt-4 space-y-1.5 rounded-sm border border-[#3a2318] bg-[#0b0807] p-3 font-mono text-xs">
                    <RuntimeLine label="image" value={language.dockerImage} />
                    {language.compileCmd && (
                      <RuntimeLine label="build" value={language.compileCmd} />
                    )}
                    <RuntimeLine label="run" value={language.runCmd} highlight />
                  </dl>
                </div>

                {/* footer */}
                <div className="relative mt-4 flex items-center justify-between border-t border-[#3a2318] pt-3">
                  <span
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      language.isSupported ? "text-[#d4af37]" : "text-[#8d6e63]"
                    )}
                  >
                    <MiniLantern lit={language.isSupported} />
                    {language.isSupported ? "Supported" : "Disabled"}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${language.name}`}
                    onClick={() => setLanguageToEdit(language)}
                    className="size-11 cursor-pointer text-[#a1887f] hover:bg-[#3a2318] hover:text-[#d4af37] md:size-8"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <LanguageDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        language={null}
        onSuccess={() => setRetryCount((count) => count + 1)}
      />
      <LanguageDialog
        open={languageToEdit !== null}
        onOpenChange={(open) => !open && setLanguageToEdit(null)}
        language={languageToEdit}
        onSuccess={() => {
          setLanguageToEdit(null);
          setRetryCount((count) => count + 1);
        }}
      />
    </div>
  );
}

/* ================================================================
   Small pieces
   ================================================================ */
function StatTile({
  watermark,
  label,
  value,
}: {
  watermark: string;
  label: string;
  value: number;
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
      <p className="relative mt-1 font-serif text-3xl font-semibold tabular-nums text-[#eaddcf]">
        {value}
      </p>
    </div>
  );
}

function RuntimeLine({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-10 shrink-0 text-[#5d4037]">{label}</dt>
      <dd className={cn("truncate", highlight ? "text-[#d4af37]" : "text-[#a1887f]")} title={value}>
        {value}
      </dd>
    </div>
  );
}

/* A paper lantern: lit in gold when the language is available, dark when it is not */
function MiniLantern({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 20 28" className="h-5 w-4" aria-hidden="true">
      {lit && <circle cx="10" cy="15" r="11" fill="#d4af37" opacity="0.2" />}
      <rect x="5" y="1" width="10" height="3" rx="1" fill="#5c3d21" />
      <rect x="5" y="24" width="10" height="3" rx="1" fill="#5c3d21" />
      <ellipse
        cx="10"
        cy="14"
        rx="7.5"
        ry="10"
        fill={lit ? "#d4af37" : "#18120e"}
        fillOpacity={lit ? 0.75 : 1}
        stroke="#5c3d21"
      />
      <g stroke="#5c3d21" strokeWidth="0.8" fill="none">
        <ellipse cx="10" cy="14" rx="7.5" ry="3" />
      </g>
    </svg>
  );
}

/* ================================================================
   Add / edit dialog
   ================================================================ */
function LanguageDialog({
  open,
  onOpenChange,
  language,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugWasEdited, setSlugWasEdited] = useState(false);
  const [monacoSlug, setMonacoSlug] = useState("");
  const [extension, setExtension] = useState("");
  const [dockerImage, setDockerImage] = useState("");
  const [compileCmd, setCompileCmd] = useState("");
  const [runCmd, setRunCmd] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(language?.name ?? "");
    setSlug(language?.slug ?? "");
    setSlugWasEdited(Boolean(language));
    setMonacoSlug(language?.monacoSlug ?? "");
    setExtension(language?.extension ?? "");
    setDockerImage(language?.dockerImage ?? "");
    setCompileCmd(language?.compileCmd ?? "");
    setRunCmd(language?.runCmd ?? "");
    setIsSupported(language?.isSupported ?? true);
  }, [language, open]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setSlugWasEdited(false);
    setMonacoSlug("");
    setExtension("");
    setDockerImage("");
    setCompileCmd("");
    setRunCmd("");
    setIsSupported(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: LanguagePayload = {
      name: name.trim(),
      slug: slug.trim(),
      monacoSlug: monacoSlug.trim(),
      extension: extension.trim(),
      dockerImage: dockerImage.trim(),
      compileCmd: compileCmd.trim() || null,
      runCmd: runCmd.trim(),
      isSupported,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        language ? `/api/language?languageId=${encodeURIComponent(language.id)}` : "/api/language",
        {
          method: language ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof result === "string"
            ? result
            : `Could not ${language ? "update" : "create"} language (${response.status})`
        );
      }

      toast.success(language ? `${payload.name} was updated.` : `${payload.name} was added.`);
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : `Could not ${language ? "update" : "create"} language.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#5c3d21] bg-linear-to-b from-[#2b1a12] to-[#18120e] text-[#eaddcf] sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-[3px] border border-[#5c3d21] bg-[#120d0a] font-serif text-xl text-[#d4af37]">
              言
            </span>
            <div className="text-left">
              <DialogTitle className="font-serif text-xl">
                {language ? "Edit Language" : "Add Language"}
              </DialogTitle>
              <DialogDescription className="text-[#a1887f]">
                {language
                  ? "Update editor metadata and runtime commands for this language."
                  : "Configure editor metadata and runtime commands for this language."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ---------- 一 Language details ---------- */}
          <section className="space-y-4 rounded-md border border-[#3a2318] bg-[#120d0a]/60 p-5">
            <h2 className="flex items-center gap-3 font-serif text-base font-semibold">
              <span className="text-[#d4af37]">一</span>
              Language details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language-name" className={labelClass}>
                  Name
                </Label>
                <Input
                  id="language-name"
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value;
                    setName(value);
                    if (!slugWasEdited) {
                      setSlug(
                        value
                          .trim()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "")
                      );
                    }
                  }}
                  placeholder="e.g. Python"
                  className={inputClass}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-slug" className={labelClass}>
                  Slug
                </Label>
                <Input
                  id="language-slug"
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value);
                    setSlugWasEdited(true);
                  }}
                  placeholder="e.g. python"
                  className={`${inputClass} font-mono`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monaco-slug" className={labelClass}>
                  Monaco language ID
                </Label>
                <Input
                  id="monaco-slug"
                  value={monacoSlug}
                  onChange={(event) => setMonacoSlug(event.target.value)}
                  placeholder="e.g. python"
                  className={`${inputClass} font-mono`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-extension" className={labelClass}>
                  File extension
                </Label>
                <Input
                  id="language-extension"
                  value={extension}
                  onChange={(event) => setExtension(event.target.value)}
                  placeholder="e.g. py"
                  className={`${inputClass} font-mono`}
                  required
                />
              </div>
            </div>

            {/* availability, as a lantern switch */}
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-[#3a2318] bg-[#0f0b0a] p-4">
              <div>
                <p className="text-sm text-[#eaddcf]">Available to users in the editor</p>
                <p className="mt-0.5 text-xs text-[#8d6e63]">
                  A lit lantern means students can pick this language.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isSupported}
                onChange={(event) => setIsSupported(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-7 w-12 shrink-0 rounded-full border border-[#5c3d21] bg-[#18120e] transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-[#5d4037] after:transition-all peer-checked:border-[#d4af37] peer-checked:bg-[#d4af37]/25 peer-checked:after:translate-x-5 peer-checked:after:bg-[#d4af37] peer-checked:after:shadow-[0_0_10px_#d4af37] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d4af37]"
              />
            </label>
          </section>

          {/* ---------- 二 Runtime configuration ---------- */}
          <section className="space-y-4 rounded-md border border-[#3a2318] bg-[#120d0a]/60 p-5">
            <div>
              <h2 className="flex items-center gap-3 font-serif text-base font-semibold">
                <span className="text-[#d4af37]">二</span>
                Runtime configuration
              </h2>
              <p className="mt-2 text-xs text-[#a1887f]">
                These values are stored for the execution service. Creating a language does not
                enable code execution by itself.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="docker-image" className={labelClass}>
                Docker image
              </Label>
              <Input
                id="docker-image"
                value={dockerImage}
                onChange={(event) => setDockerImage(event.target.value)}
                placeholder="e.g. python:3.12-slim"
                className={`${terminalClass} h-11`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compile-command" className={labelClass}>
                Compile command <span className="text-[#5d4037]">(optional)</span>
              </Label>
              <Textarea
                id="compile-command"
                value={compileCmd}
                onChange={(event) => setCompileCmd(event.target.value)}
                placeholder="Leave blank for interpreted languages"
                className={terminalClass}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="run-command" className={labelClass}>
                Run command
              </Label>
              <Textarea
                id="run-command"
                value={runCmd}
                onChange={(event) => setRunCmd(event.target.value)}
                placeholder="e.g. python3 main.py"
                className={terminalClass}
                rows={2}
                required
              />
            </div>
          </section>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer border-[#5c3d21] bg-transparent text-[#a1887f] hover:border-[#8d6e63] hover:bg-[#2b1a12] hover:text-[#eaddcf]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-[#d4af37] font-semibold text-[#1a110d] hover:bg-[#c5a028]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {language ? "Saving..." : "Creating..."}
                </>
              ) : language ? (
                "Save Changes"
              ) : (
                "Create Language"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
