"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminPageHeader from "@/components/Admin/RouteSide/AdminPageHeader";
import { CatSeal } from "@/components/User/Profileornaments";
import { CreateCategoryDialog } from "./CreateDialog";
import { EditCategoryDialog } from "./EditDialog";
import { DeleteCategoryDialog } from "./DeleteDialog";

export default function CategoryClient({ data }: { data: CategoryWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithRelations | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryWithRelations | null>(null);

  const filteredCategories = data.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Categories"
        kanji="分野"
        description="The path members walk, one stone at a time. Each category opens up after the ones before it."
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-[#d4af37] px-5 text-[#0f0b0a] hover:bg-[#b5952f]"
          >
            <Plus aria-hidden /> Add category
          </Button>
          <p className="text-sm text-[#a1887f]">
            <span className="font-serif text-2xl tabular-nums text-[#eaddcf]">{data.length}</span>{" "}
            {data.length === 1 ? "stone" : "stones"} on the path
          </p>
        </div>
      </AdminPageHeader>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <label htmlFor="category-search" className="sr-only">
            Search categories
          </label>
          <Search
            className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#8d6e63]"
            aria-hidden
          />
          <Input
            id="category-search"
            placeholder="Search categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 rounded-none border-0 border-b border-[#3e2723] bg-transparent pl-7 text-[#eaddcf] shadow-none placeholder:text-[#6d4c41] focus-visible:border-[#d4af37] focus-visible:ring-0"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-[#8d6e63]">
            {filteredCategories.length} of {data.length} shown
          </p>
        )}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center border-y border-[#3e2723] px-4 py-20 text-center">
          <CatSeal className="size-12 text-[#5d4037]" />
          <h2 className="mt-6 font-serif text-xl text-[#eaddcf]">
            {searchTerm ? "Nothing on the path matches" : "The path is empty"}
          </h2>
          <p className="mt-2 text-sm text-[#a1887f]">
            {searchTerm
              ? `No categories match \u201C${searchTerm}\u201D.`
              : "Add the first category to lay the first stone."}
          </p>
        </div>
      ) : (
        <ol>
          {filteredCategories.map((cat) => (
            <li
              key={cat.id}
              className="relative pb-10 pl-16 last:pb-0 after:absolute after:bottom-0 after:left-[1.1rem] after:top-11 after:w-px after:bg-[#3e2723] last:after:hidden"
            >
              {/* The stepping stone */}
              <span
                aria-label={`Order ${cat.categoryOrder}`}
                className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-[#d4af37]/60 bg-[#0f0b0a] font-serif text-sm tabular-nums text-[#d4af37]"
              >
                {cat.categoryOrder}
              </span>

              <div className="grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="min-w-0">
                  <h2 className="font-serif text-xl text-[#eaddcf]">{cat.name}</h2>
                  <p className="mt-0.5 font-mono text-xs text-[#8d6e63]">{cat.slug}</p>

                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    {cat.prerequisiteArray.length > 0 ? (
                      <>
                        <span className="text-[#8d6e63]">Opens after</span>
                        {cat.prerequisiteArray.map((pre) => (
                          <span
                            key={pre.slug}
                            className="rounded-full border border-[#3e2723] px-2.5 py-0.5 text-xs text-[#a1887f]"
                          >
                            {pre.name}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-[#8d6e63]">
                        Starting point, open from the first day
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
                  <div className="text-right">
                    <p className="font-serif text-xl tabular-nums leading-none text-[#eaddcf]">
                      {cat._count.questions}
                    </p>
                    <p className="mt-1 text-xs text-[#8d6e63]">
                      {cat._count.questions === 1 ? "kata" : "katas"}
                    </p>
                  </div>
                  <p className="hidden text-xs text-[#8d6e63] lg:block" suppressHydrationWarning>
                    Updated {format(new Date(cat.updatedAt), "MMM d, yyyy")}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryToEdit(cat)}
                      className="h-11 px-3 text-[#a1887f] hover:bg-transparent hover:text-[#d4af37] md:h-8"
                    >
                      <Pencil className="mr-1.5 size-3.5" aria-hidden />
                      Edit
                      <span className="sr-only"> {cat.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryToDelete(cat)}
                      className="h-11 px-3 text-[#8d6e63] hover:bg-transparent hover:text-[#d4796b] md:h-8"
                    >
                      <Trash2 className="mr-1.5 size-3.5" aria-hidden />
                      Delete
                      <span className="sr-only"> {cat.name}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <CreateCategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        allCategories={data}
      />

      <EditCategoryDialog
        open={!!categoryToEdit}
        onOpenChange={(open) => !open && setCategoryToEdit(null)}
        category={categoryToEdit}
        allCategories={data}
        onSuccess={() => setCategoryToEdit(null)}
      />

      <DeleteCategoryDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        category={categoryToDelete}
        onSuccess={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
