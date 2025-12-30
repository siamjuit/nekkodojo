"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  // Helper to construct the URL while keeping existing search params (like ?search=...)
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  // Helper to determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // How many numbers to show before ellipsis

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for Ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        
        {/* PREVIOUS BUTTON */}
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            className={`
              border-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#d4af37]
              ${currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            `}
          />
        </PaginationItem>

        {/* PAGE NUMBERS */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis className="text-[#5d4037]" />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                className={`
                  border-[#3e2723] cursor-pointer
                  ${currentPage === page 
                    ? "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37] hover:bg-[#d4af37]/20 hover:text-[#d4af37]" 
                    : "text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#eaddcf] bg-transparent"
                  }
                `}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* NEXT BUTTON */}
        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            className={`
              border-[#3e2723] text-[#a1887f] hover:bg-[#3e2723]/20 hover:text-[#d4af37]
              ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            `}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}