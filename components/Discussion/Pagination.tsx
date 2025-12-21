"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PageProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DiscussionPagination = ({ currentPage, totalPages, onPageChange }: PageProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <>
      <Pagination className="mt-12 mb-8">
        <PaginationContent className="bg-[#1a110d]/50 border border-[#3e2723] rounded-full px-4 py-1 backdrop-blur-sm">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => handlePageChange(currentPage - 1, e)}
              className={`
              text-[#a1887f] hover:text-[#d4af37] hover:bg-transparent transition-colors
              ${currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            `}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => handlePageChange(1, e)}
              className={
                currentPage === 1
                  ? "bg-[#d4af37] text-[#1a110d] hover:bg-[#d4af37] hover:text-[#1a110d]"
                  : "text-[#eaddcf] hover:text-[#d4af37] hover:bg-[#3e2723]/30"
              }
            >
              1
            </PaginationLink>
          </PaginationItem>

          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis className="text-[#5d4037]" />
            </PaginationItem>
          )}

          {currentPage > 1 && currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={true}
                onClick={(e) => e.preventDefault}
                className="bg-[#d4af37] text-[#1a110d] hover:bg-[#d4af37] hover:text-[#1a110d]"
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis className="text-[#5d4037]" />
            </PaginationItem>
          )}

          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === totalPages}
                onClick={(e) => handlePageChange(totalPages, e)}
                className={
                  currentPage === totalPages
                    ? "bg-[#d4af37] text-[#1a110d] hover:bg-[#d4af37] hover:text-[#1a110d]"
                    : "text-[#eaddcf] hover:text-[#d4af37] hover:bg-[#3e2723]/30"
                }
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => handlePageChange(currentPage + 1, e)}
              className={`
              text-[#a1887f] hover:text-[#d4af37] hover:bg-transparent transition-colors
              ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            `}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default DiscussionPagination;
