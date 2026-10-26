"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Occasion } from "@/data/mockData";
import { ArrowUpRight } from "lucide-react";

interface OccasionCardProps {
  occasion: Occasion;
}

export default function OccasionCard({ occasion }: OccasionCardProps) {
  return (
    <Link
      href={`/vendors?occasion=${occasion.slug}`}
      className="group relative h-72 sm:h-80 w-full rounded-none overflow-hidden shadow-luxury border border-[#26282E] hover:border-[#DFB76C]/60 flex flex-col justify-end p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Background Image */}
      <Image
        src={occasion.image}
        alt={occasion.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
      />

      {/* Dark & Gold Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#DFB76C]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-none bg-[#0B0C0E]/80 backdrop-blur-md text-[#DFB76C] border border-[#DFB76C]/30">
          {occasion.eventCount}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-1 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#DFB76C] transition-colors">
            {occasion.title}
          </h3>
          <div className="w-7 h-7 rounded-none bg-[#121418]/80 border border-[#26282E] backdrop-blur-md flex items-center justify-center text-slate-300 group-hover:bg-[#DFB76C] group-hover:text-[#0B0C0E] group-hover:border-[#DFB76C] transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {occasion.subtitle}
        </p>
      </div>
    </Link>
  );
}
