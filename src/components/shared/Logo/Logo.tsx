"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo/logo.png";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light" | "admin" | "vendor";
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function Logo({ 
  className, 
  variant = "light", 
  href = "/",
  size = "md",
  showText = true 
}: LogoProps) {
  const isDark = variant === "admin" || variant === "dark";

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9 md:w-10 md:h-10",
    lg: "w-11 h-11 md:w-12 md:h-12",
    xl: "w-14 h-14"
  };

  return (
    <Link 
      href={href} 
      className={cn("inline-flex items-center gap-3 group select-none transition-transform duration-300", className)}
      aria-label="Ophir Reserve"
    >
      <div className={cn(
        "relative flex-shrink-0 flex items-center justify-center",
        sizeClasses[size]
      )}>
        <Image
          src={logoImg}
          alt="Ophir Reserve"
          width={56}
          height={56}
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(223,183,108,0.3)]"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base tracking-[0.22em] text-[#DFB76C] uppercase leading-none">
              Ophir Reserve
            </span>

            {variant === "admin" && (
              <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-none bg-[#DFB76C] text-[#0B0C0E] uppercase">
                ADMIN
              </span>
            )}

            {variant === "vendor" && (
              <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] uppercase border border-[#DFB76C]/30">
                PORTAL
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-sans mt-0.5">
            Curated Heritage
          </span>
        </div>
      )}

      {!showText && variant === "admin" && (
        <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-none bg-[#DFB76C] text-[#0B0C0E] uppercase">
          ADMIN
        </span>
      )}

      {!showText && variant === "vendor" && (
        <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] uppercase border border-[#DFB76C]/30">
          PORTAL
        </span>
      )}
    </Link>
  );
}
