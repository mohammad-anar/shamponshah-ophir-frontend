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
  showText = false 
}: LogoProps) {
  const isDark = variant === "admin" || variant === "dark";

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-11 md:h-11",
    lg: "w-12 h-12 md:w-14 md:h-14",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <Link 
      href={href} 
      className={cn("inline-flex items-center gap-2.5 group select-none transition-transform duration-300 hover:scale-105", className)}
      aria-label="Ophir Home"
    >
      <div className={cn(
        "relative flex-shrink-0 flex items-center justify-center",
        sizeClasses[size]
      )}>
        <Image
          src={logoImg}
          alt="Ophir"
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-xs"
          priority
        />
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-black tracking-tight leading-none font-serif",
            textSizeClasses[size],
            isDark ? "text-white" : "text-[#0F0C3B]"
          )}>
            Ophir
          </span>

          {variant === "admin" && (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F59E0B] text-[#0F0C3B] uppercase shadow-xs">
              ADMIN
            </span>
          )}

          {variant === "vendor" && (
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] uppercase border border-[#FDE68A] shadow-xs">
              SELLER MODE
            </span>
          )}
        </div>
      )}

      {!showText && variant === "admin" && (
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F59E0B] text-[#0F0C3B] uppercase shadow-xs">
          ADMIN
        </span>
      )}

      {!showText && variant === "vendor" && (
        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] uppercase border border-[#FDE68A] shadow-xs">
          SELLER
        </span>
      )}
    </Link>
  );
}
