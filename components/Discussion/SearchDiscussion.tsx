"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { getTags } from "@/lib/getTags";

interface Props {
  inputValue: string;
  setInputValue: (input: string) => void;
}

const SearchDiscussion = ({ inputValue, setInputValue }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allTags, setAllTags] = useState<TagProps[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagProps[]>([]);

  useEffect(() => {
    const getAllTags = async () => {
      try {
        const t: TagProps[] = await getTags();
        if (t) {
          setAllTags(t);
          setFilteredTags(t);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllTags();
  }, []);

  const [debouncedValue] = useDebounce(inputValue, 500);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [triggerWord, setTriggerWord] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const tag = searchParams.get("tag");
    let urlString = query;

    if (tag && allTags.length > 0) {
      const tagConfig = allTags.find((t) => t.slug === tag);
      const tagLabel = tagConfig ? `:${tagConfig.slug}` : "";
      urlString = query ? `${query} ${tagLabel}` : tagLabel;
    }

    const cleanUrl = urlString.trim();
    const cleanInput = inputValue.trim();

    if (!cleanUrl && cleanInput) {
      setInputValue("");
    } else if (cleanUrl && !cleanInput) {
      setInputValue(urlString);
    } else if (cleanUrl !== cleanInput) {
      if (!cleanInput.startsWith(cleanUrl)) {
        setInputValue(urlString);
      }
    }
  }, [searchParams, allTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const words = value.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith(":") || lastWord.startsWith("#")) {
      const searchTerm = lastWord.slice(1).toLowerCase();

      // 3. FIX: Filter from 'allTags', not 'filteredTags'
      const matches = allTags.filter(
        (t) =>
          t.name.toLowerCase().replace(/\s+/g, "").includes(searchTerm) ||
          t.slug.toLowerCase().includes(searchTerm)
      );

      setFilteredTags(matches);
      setTriggerWord(lastWord);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectTag = (tagConfig: TagProps) => {
    // 4. Use the slug for the input value to ensure uniqueness and match your regex logic
    const formattedTag = `:${tagConfig.slug}`;

    const newValue = inputValue.replace(triggerWord, formattedTag);

    setInputValue(newValue + " ");
    setShowSuggestions(false);

    const input = document.querySelector('input[name="search-bar"]') as HTMLInputElement;
    if (input) input.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTags.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTags.length) % filteredTags.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTags[selectedIndex]) {
        selectTag(filteredTags[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = useCallback(
    (searchValue: string) => {
      // Guard: Don't search if we don't have tags yet (prevents race conditions)
      if (allTags.length === 0) return;

      let finalQuery = searchValue;
      let finalTag: string | null = null;

      // Allow :tagname or tag:tagname
      const tagRegex = /(?::|#|tag:)([a-zA-Z0-9_+\-']+)/i;
      const match = searchValue.match(tagRegex);

      if (match) {
        const capturedTag = match[1].toLowerCase();

        // 5. FIX: Look inside 'allTags'
        const foundTag = allTags.find((t) => {
          const normalizedLabel = t.name.replace(/\s+/g, "").toLowerCase();
          const normalizedValue = t.slug.toLowerCase();
          // Check both name and slug
          return normalizedLabel === capturedTag || normalizedValue === capturedTag;
        });

        if (foundTag) {
          finalTag = foundTag.slug;
          // Remove the tag text from the query string sent to the server
          finalQuery = finalQuery.replace(match[0], "").trim();
        }
      }

      const params = new URLSearchParams();
      if (finalQuery) params.set("query", finalQuery);
      if (finalTag) params.set("tag", finalTag);

      const currentSort = searchParams.get("sort");
      if (currentSort) params.set("sort", currentSort);

      // Reset pagination on new search
      params.set("page", "1");
      params.set("limit", "10");

      const currentQuery = searchParams.get("query") || "";
      const currentTag = searchParams.get("tag");

      // Only push if something actually changed
      if (currentQuery !== finalQuery || currentTag !== (finalTag || null)) {
        router.push(`/discussions?${params.toString()}`);
      }
    },
    [router, searchParams, allTags] // Added allTags dependency
  );

  useEffect(() => {
    performSearch(debouncedValue);
  }, [debouncedValue, performSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSuggestions) {
      performSearch(inputValue);
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full max-w-2xl mb-8 relative z-50">
        <form onSubmit={handleFormSubmit} className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d4037] group-focus-within:text-[#d4af37] transition-colors">
            <Search size={18} />
          </div>

          <Input
            name="search-bar"
            placeholder="Search... (type : for tags)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="pl-10 h-12 bg-[#1a110d]/50 border-[#3e2723] text-[#eaddcf] placeholder:text-[#5d4037] focus:border-[#d4af37] rounded-xl shadow-inner"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:block pointer-events-none">
            <span className="text-[10px] text-[#5d4037] bg-[#1a110d] px-2 py-1 rounded border border-[#3e2723]">
              Tip: Use <b>:</b> to filter
            </span>
          </div>
        </form>
        {showSuggestions && filteredTags.length > 0 && (
          <div className="absolute top-14 left-0 w-full bg-[#1a110d] border border-[#3e2723] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 text-[10px] font-mono text-[#5d4037] uppercase tracking-wider bg-[#0f0b0a]/50 border-b border-[#3e2723]/30">
              Select Tag
            </div>
            {filteredTags.map((tag, index) => (
              <div
                key={tag.slug}
                onClick={() => selectTag(tag)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm font-medium",
                  index === selectedIndex
                    ? "bg-[#3e2723]/40 text-[#d4af37]"
                    : "text-[#eaddcf] hover:bg-[#3e2723]/20 hover:text-[#d4af37]"
                )}
              >
                {/* 6. Safer color logic: use the whole string or parse carefully */}
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    // Simple hack: apply the whole string. The 'bg-...' part will work.
                    // The text/border parts will just be ignored on an empty span.
                    tag.color
                  )}
                />
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchDiscussion;
