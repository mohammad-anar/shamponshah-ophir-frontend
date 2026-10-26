import { ReactNode } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Secure Sign In & Account Portal | Ophir",
  description: "Access your Ophir buyer or seller account. Escrow-protected milestone planning and verified vendor dashboard.",
  noIndex: true, // Auth pages shouldn't rank on SERPs
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0B0C0E] text-[#F3F4F6] flex flex-col justify-between selection:bg-[#DFB76C] selection:text-[#0B0C0E] overflow-x-hidden font-sans">
      {children}
    </div>
  );
}

