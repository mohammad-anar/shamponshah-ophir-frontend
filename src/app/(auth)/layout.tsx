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
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between selection:bg-brand selection:text-on-brand overflow-x-hidden font-sans">
      {children}
    </div>
  );
}

