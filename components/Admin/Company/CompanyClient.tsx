"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminPageHeader from "@/components/Admin/RouteSide/AdminPageHeader";
import { CatSeal, EnsoRing } from "@/components/User/Profileornaments";
import { CreateCompanyDialog } from "./CreateDialog";
import { EditCompanyDialog } from "./EditDialog";
import { DeleteCompanyDialog } from "./DeleteDialog";

export default function CompanyClient() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [compToDelete, setCompToDelete] = useState<CompanyData | null>(null);
  const [compToEdit, setCompToEdit] = useState<CompanyData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCompanies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/companies?admin=true");
        if (!response.ok) throw new Error("Failed to fetch companies.");
        const companies = (await response.json()) as CompanyData[];
        if (!cancelled) setData(companies);
      } catch (fetchError) {
        console.error("Failed to load companies:", fetchError);
        if (!cancelled) setError("Unable to load companies.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadCompanies();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filtered = data.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return (
      <div
        className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-[#a1887f]"
        role="status"
        aria-live="polite"
      >
        <CatSeal className="size-10 text-[#5d4037]" />
        <p className="flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin text-[#d4af37]" aria-hidden />
          Gathering the crests…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 text-center">
        <CatSeal className="size-10 text-[#5d4037]" />
        <p role="alert" className="text-sm text-[#d4796b]">
          {error}
        </p>
        <Button
          onClick={() => setRetryCount((count) => count + 1)}
          variant="ghost"
          className="rounded-full border border-[#3e2723] px-5 text-[#eaddcf] hover:border-[#d4af37] hover:bg-transparent hover:text-[#d4af37]"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Companies"
        kanji="企業"
        description="The great houses members train to face. Each crest gathers the katas asked in that company's interviews."
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-[#d4af37] px-5 text-[#0f0b0a] hover:bg-[#b5952f]"
          >
            <Plus aria-hidden /> Add company
          </Button>
          <p className="text-sm text-[#a1887f]">
            <span className="font-serif text-2xl tabular-nums text-[#eaddcf]">{data.length}</span>{" "}
            {data.length === 1 ? "crest" : "crests"} on the wall
          </p>
        </div>
      </AdminPageHeader>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <label htmlFor="company-search" className="sr-only">
            Search companies
          </label>
          <Search
            className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#8d6e63]"
            aria-hidden
          />
          <Input
            id="company-search"
            placeholder="Search companies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 rounded-none border-0 border-b border-[#3e2723] bg-transparent pl-7 text-[#eaddcf] shadow-none placeholder:text-[#6d4c41] focus-visible:border-[#d4af37] focus-visible:ring-0"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-[#8d6e63]">
            {filtered.length} of {data.length} shown
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center border-y border-[#3e2723] px-4 py-20 text-center">
          <CatSeal className="size-12 text-[#5d4037]" />
          <h2 className="mt-6 font-serif text-xl text-[#eaddcf]">
            {searchTerm ? "No crest matches" : "The wall is bare"}
          </h2>
          <p className="mt-2 text-sm text-[#a1887f]">
            {searchTerm
              ? `No companies match \u201C${searchTerm}\u201D.`
              : "Add the first company to hang its crest."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((comp) => {
            const count = comp._count.questions;
            return (
              <li key={comp.id} className="group flex flex-col items-center text-center">
                {/* The crest: a logo inside an open enso ring */}
                <div className="relative size-28 text-[#d4af37]/40 transition-colors duration-300 group-hover:text-[#d4af37] group-focus-within:text-[#d4af37]">
                  <EnsoRing />
                  <div className="absolute inset-[13%] overflow-hidden rounded-full border border-[#3e2723] bg-white/5">
                    {comp.logo ? (
                      <Image
                        src={comp.logo}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-contain p-3"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center font-serif text-2xl text-[#a1887f]">
                        {comp.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="mt-5 font-serif text-lg leading-tight text-[#eaddcf] transition-colors group-hover:text-[#d4af37]">
                  {comp.name}
                </h2>
                <p className="mt-1 font-mono text-xs text-[#8d6e63]">{comp.slug}</p>

                <p className="mt-3 text-sm text-[#a1887f]">
                  {count > 0 ? (
                    <>
                      <span className="font-serif text-lg tabular-nums text-[#eaddcf]">
                        {count}
                      </span>{" "}
                      {count === 1 ? "kata" : "katas"}
                    </>
                  ) : (
                    "No katas yet"
                  )}
                </p>

                {comp.websiteUrl && (
                  <Link
                    href={comp.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-[#d4af37] underline-offset-4 hover:underline"
                  >
                    Website
                    <ArrowUpRight className="size-3" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </Link>
                )}

                <div className="mt-3 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompToEdit(comp)}
                    className="h-11 px-3 text-[#a1887f] hover:bg-transparent hover:text-[#d4af37] md:h-8"
                  >
                    <Pencil className="mr-1.5 size-3.5" aria-hidden />
                    Edit
                    <span className="sr-only"> {comp.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompToDelete(comp)}
                    className="h-11 px-3 text-[#8d6e63] hover:bg-transparent hover:text-[#d4796b] md:h-8"
                  >
                    <Trash2 className="mr-1.5 size-3.5" aria-hidden />
                    Delete
                    <span className="sr-only"> {comp.name}</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <CreateCompanyDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => setRetryCount((count) => count + 1)}
      />
      <EditCompanyDialog
        open={!!compToEdit}
        onOpenChange={(open) => !open && setCompToEdit(null)}
        company={compToEdit}
        onSuccess={() => {
          setCompToEdit(null);
          setRetryCount((count) => count + 1);
        }}
      />
      <DeleteCompanyDialog
        open={!!compToDelete}
        onOpenChange={(open) => !open && setCompToDelete(null)}
        company={compToDelete}
        onSuccess={() => {
          setCompToDelete(null);
          setRetryCount((count) => count + 1);
        }}
      />
    </div>
  );
}
