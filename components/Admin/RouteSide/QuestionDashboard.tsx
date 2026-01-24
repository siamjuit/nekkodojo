"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  Tag,
  Building2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { EditQuestionDialog } from "../Questions/EditDialog";
import { DeleteQuestionDialog } from "../Questions/DeleteDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialCategories: Category[];
  allCompanies: { name: string; slug: string }[];
}

export default function QuestionsDashboard({ initialCategories, allCompanies }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  const categoryOptions = initialCategories.map((c) => ({ label: c.name, value: c.slug }));
  const companyOptions = allCompanies.map((c) => ({ label: c.name, value: c.slug }));

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (searchQuery) params.set("query", searchQuery);

        const res = await fetch(`/api/questions?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchQuestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery]);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* --- 1. TOP NAVIGATION CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            title: "Categories",
            icon: Layers,
            href: "/admin/questions/category",
            desc: "Manage hierarchy",
          },
          { title: "Tags", icon: Tag, href: "/admin/discussions/tag", desc: "Manage topics" },
          { title: "Companies", icon: Building2, href: "/admin/companies", desc: "Manage orgs" },
          {
            title: "Add Question",
            icon: Plus,
            href: "/admin/questions/create",
            desc: "New problem",
            active: true,
          },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="w-full">
            <div
              className={cn(
                "p-3 md:p-4 rounded-xl border transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between",
                item.active
                  ? "bg-[#d4af37] border-[#d4af37] text-black hover:bg-[#b5952f]"
                  : "bg-[#1a110d] border-[#3e2723] text-[#eaddcf] hover:border-[#d4af37]/50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span className="font-bold text-sm md:text-base truncate">{item.title}</span>
              </div>
              <p
                className={cn(
                  "text-[10px] md:text-xs truncate",
                  item.active ? "text-black/70" : "text-[#a1887f]"
                )}
              >
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {/* --- 2. FILTER HEADER --- */}
        <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-[#3e2723]">
            <h2 className="text-base md:text-lg font-semibold text-[#eaddcf] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">Filter by Category</span>
              <span className="sm:hidden">Filters</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]"
            >
              {isExpanded ? (
                <span className="flex items-center text-xs">
                  Collapse <ChevronUp className="ml-1 w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center text-xs">
                  Expand <ChevronDown className="ml-1 w-4 h-4" />
                </span>
              )}
            </Button>
          </div>

          <div
            className={cn(
              "transition-all duration-300 ease-in-out bg-[#0f0b0a]/50",
              isExpanded ? "max-h-[500px] opacity-100" : "max-h-[60px] opacity-100 overflow-hidden"
            )}
          >
            <div className="p-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap",
                  selectedCategory === "all"
                    ? "bg-[#d4af37] text-black border-[#d4af37]"
                    : "bg-[#1a110d] text-[#a1887f] border-[#3e2723] hover:border-[#d4af37]/50 hover:text-[#eaddcf]"
                )}
              >
                All
              </button>
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap",
                    selectedCategory === cat.slug
                      ? "bg-[#d4af37] text-black border-[#d4af37]"
                      : "bg-[#1a110d] text-[#a1887f] border-[#3e2723] hover:border-[#d4af37]/50 hover:text-[#eaddcf]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. SEARCH & TABLE --- */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5d4037]" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a110d] border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037]"
            />
          </div>

          {/* Table Wrapper */}
          <div className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 overflow-hidden min-h-[300px] w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#3e2723] bg-[#0f0b0a] text-[#a1887f]">
                    <th className="p-4 font-medium min-w-[200px]">Title</th>
                    <th className="p-4 font-medium">Categories</th>
                    <th className="p-4 font-medium">Difficulty</th>
                    <th className="p-4 font-medium">Companies</th>
                    <th className="p-4 font-medium text-right">Actions</th>{" "}
                    {/* ✅ Removed sticky classes */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e2723]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-[#d4af37]">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-sm text-[#a1887f]">Summoning Katas...</span>
                        </div>
                      </td>
                    </tr>
                  ) : questions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#5d4037]">
                        No questions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => (
                      <tr key={q.id} className="group hover:bg-[#3e2723]/10 transition-colors">
                        <td className="p-4">
                          <Link
                            href={q.externalPlatformUrl}
                            target="_blank"
                            className="font-medium text-[#eaddcf] hover:text-[#d4af37] hover:underline block max-w-[200px] md:max-w-none truncate"
                          >
                            {q.title}
                          </Link>
                          {/* Mobile-only tags */}
                          <div className="md:hidden mt-1 flex gap-1">
                            {q.categories.slice(0, 2).map((c) => (
                              <span key={c.slug} className="text-[10px] text-[#a1887f]">
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {q.categories.map((cat) => (
                              <span
                                key={cat.slug}
                                className="text-[10px] text-[#a1887f] bg-[#3e2723]/30 px-1.5 py-0.5 rounded border border-transparent hover:border-[#5d4037]"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn("text-xs border", getDifficultyColor(q.difficulty))}
                          >
                            {q.difficulty}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex -space-x-2 overflow-hidden">
                            {q.companyTag.slice(0, 3).map((comp, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 relative rounded-full bg-[#1a110d] border border-[#3e2723] flex items-center justify-center text-[8px] text-[#eaddcf] font-bold overflow-hidden"
                                title={comp.name}
                              >
                                {comp.logo ? (
                                  <Image
                                    src={comp.logo}
                                    alt={comp.name}
                                    fill
                                    className="object-contain p-0.5 rounded-full"
                                  />
                                ) : (
                                  <span>{comp.name.substring(0, 1).toUpperCase()}</span>
                                )}
                              </div>
                            ))}
                            {q.companyTag.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-[#1a110d] border border-[#3e2723] flex items-center justify-center text-[8px] text-[#a1887f]">
                                +{q.companyTag.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {" "}
                          {/* ✅ Removed sticky classes */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]"
                            >
                              <DropdownMenuItem
                                onClick={() => setQuestionToEdit(q)}
                                className="hover:bg-[#3e2723] cursor-pointer"
                              >
                                Edit Question
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setQuestionToDelete(q)}
                                className="hover:bg-[#3e2723] cursor-pointer text-red-400 focus:text-red-400"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <EditQuestionDialog
        open={!!questionToEdit}
        onOpenChange={(open) => !open && setQuestionToEdit(null)}
        question={questionToEdit}
        categoryOptions={categoryOptions}
        companyOptions={companyOptions}
        onSuccess={() => {
          setQuestionToEdit(null);
          setSelectedCategory("");
        }}
      />

      <DeleteQuestionDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        question={questionToDelete}
        onSuccess={() => {
          setQuestionToDelete(null);
          setSelectedCategory("");
        }}
      />
    </div>
  );
}
