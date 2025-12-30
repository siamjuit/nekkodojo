"use client";

import { useState } from "react";
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
  FileText
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

// --- MOCK DATA (Replace with DB data later) ---
const CATEGORIES = [
  { id: "all", name: "All Topics", slug: "all" },
  { id: "1", name: "Arrays & Hashing", slug: "arrays-hashing" },
  { id: "2", name: "Two Pointers", slug: "two-pointers" },
  { id: "3", name: "Sliding Window", slug: "sliding-window" },
  { id: "4", name: "Stack", slug: "stack" },
  { id: "5", name: "Binary Search", slug: "binary-search" },
  { id: "6", name: "Linked List", slug: "linked-list" },
  { id: "7", name: "Trees", slug: "trees" },
  { id: "8", name: "Tries", slug: "tries" },
  { id: "9", name: "Backtracking", slug: "backtracking" },
  { id: "10", name: "Graphs", slug: "graphs" },
  { id: "11", name: "DP - 1D", slug: "dp-1d" },
];

const MOCK_QUESTIONS = [
  {
    id: "q1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Amazon", "Apple"],
    tags: ["Array", "Hash Table"],
  },
  {
    id: "q2",
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    companies: ["Amazon", "Microsoft", "Meta"],
    tags: ["Linked List", "Math", "Recursion"],
  },
  {
    id: "q3",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    companies: ["Google", "Adobe", "Uber"],
    tags: ["Array", "Binary Search", "Divide & Conquer"],
  },
  {
    id: "q4",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "DP - 1D",
    companies: ["Amazon", "Microsoft"],
    tags: ["String", "DP"],
  },
  {
    id: "q5",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    companies: ["Facebook", "Amazon", "Apple"],
    tags: ["String", "Stack"],
  },
];

export default function QuestionsDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredQuestions = MOCK_QUESTIONS.filter((q) => {
    const matchesCategory = selectedCategory === "All Topics" || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Difficulty Color Helper
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Hard": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* --- 1. TOP NAVIGATION CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Categories", icon: Layers, href: "/admin/questions/category", desc: "Manage hierarchy" },
          { title: "Discussion Tags", icon: Tag, href: "/admin/discussions/tag", desc: "Manage topics" },
          { title: "Companies", icon: Building2, href: "/admin/companies", desc: "Manage organizations" },
          { title: "Add Question", icon: Plus, href: "/admin/questions/create", desc: "Create new problem", active: true },
        ].map((item) => (
          <Link key={item.title} href={item.href}>
            <div className={cn(
              "p-4 rounded-xl border transition-all hover:-translate-y-1 cursor-pointer h-full",
              item.active 
                ? "bg-[#d4af37] border-[#d4af37] text-black hover:bg-[#b5952f]" 
                : "bg-[#1a110d] border-[#3e2723] text-[#eaddcf] hover:border-[#d4af37]/50"
            )}>
              <div className="flex items-center gap-3 mb-2">
                <item.icon className="w-5 h-5" />
                <span className="font-bold">{item.title}</span>
              </div>
              <p className={cn("text-xs", item.active ? "text-black/70" : "text-[#a1887f]")}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        
        {/* --- 2. LEETCODE STYLE EXPANDABLE HEADER --- */}
        <div className="rounded-xl border border-[#3e2723] bg-[#1a110d] overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-[#3e2723]">
            <h2 className="text-lg font-semibold text-[#eaddcf] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              Filter by Category
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#a1887f] hover:text-[#d4af37]"
            >
              {isExpanded ? (
                <span className="flex items-center text-xs">Collapse <ChevronUp className="ml-1 w-4 h-4" /></span>
              ) : (
                <span className="flex items-center text-xs">Expand <ChevronDown className="ml-1 w-4 h-4" /></span>
              )}
            </Button>
          </div>
          
          <div className={cn(
            "transition-all duration-300 ease-in-out bg-[#0f0b0a]/50",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-[60px] opacity-100 overflow-hidden"
          )}>
            <div className="p-4 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                    selectedCategory === cat.name
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
              placeholder="Search questions by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a110d] border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037]"
            />
          </div>

          <div className="rounded-xl border border-[#3e2723] bg-[#1a110d]/40 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3e2723] bg-[#0f0b0a] text-[#a1887f]">
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Difficulty</th>
                  <th className="p-4 font-medium">Companies</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3e2723]">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#5d4037]">
                      No questions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="group hover:bg-[#3e2723]/10 transition-colors">
                      <td className="p-4">
                        {/* Placeholder for Solved/Unsolved status */}
                        <div className="w-4 h-4 rounded-full border border-[#5d4037]" />
                      </td>
                      <td className="p-4">
                        <Link href={`/questions/${q.id}`} className="font-medium text-[#eaddcf] hover:text-[#d4af37] hover:underline">
                          {q.title}
                        </Link>
                        <div className="flex gap-2 mt-1">
                          {q.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-[#a1887f] bg-[#3e2723]/30 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-[#a1887f]">
                        {q.category}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("text-xs border", getDifficultyColor(q.difficulty))}>
                          {q.difficulty}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {q.companies.slice(0, 3).map((comp, i) => (
                            <div 
                              key={i} 
                              className="w-6 h-6 rounded-full bg-[#1a110d] border border-[#3e2723] flex items-center justify-center text-[8px] text-[#eaddcf] font-bold"
                              title={comp}
                            >
                              {comp.substring(0, 1)}
                            </div>
                          ))}
                          {q.companies.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-[#1a110d] border border-[#3e2723] flex items-center justify-center text-[8px] text-[#a1887f]">
                              +{q.companies.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a1887f] hover:text-[#d4af37]">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf]">
                            <DropdownMenuItem className="hover:bg-[#3e2723] cursor-pointer">
                              Edit Question
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-[#3e2723] cursor-pointer text-red-400 focus:text-red-400">
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
  );
}