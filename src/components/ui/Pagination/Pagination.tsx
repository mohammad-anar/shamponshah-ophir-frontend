"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  theme?: "navy" | "indigo";
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  theme = "navy",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const activeBg = "bg-[#DFB76C] text-[#0B0C0E] border-[#DFB76C] shadow-gold-glow-sm font-bold";

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5 pt-8 pb-4 select-none", className)}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "inline-flex items-center gap-1 px-3.5 py-2 rounded-none text-xs font-bold border transition-all cursor-pointer",
          currentPage === 1
            ? "border-[#26282E] bg-[#0E1013] text-slate-600 cursor-not-allowed"
            : "border-[#26282E] bg-[#121418] text-slate-300 hover:bg-[#1A1D24] hover:border-[#DFB76C]/40"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-500 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-9 h-9 rounded-none text-xs font-bold border transition-all flex items-center justify-center cursor-pointer",
                isActive
                  ? activeBg
                  : "border-[#26282E] bg-[#121418] text-slate-300 hover:bg-[#1A1D24] hover:border-[#DFB76C]/40"
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "inline-flex items-center gap-1 px-3.5 py-2 rounded-none text-xs font-bold border transition-all cursor-pointer",
          currentPage === totalPages
            ? "border-[#26282E] bg-[#0E1013] text-slate-600 cursor-not-allowed"
            : "border-[#26282E] bg-[#121418] text-slate-300 hover:bg-[#1A1D24] hover:border-[#DFB76C]/40"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
