import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Ophir | The Modern Milestone & Escrow Marketplace",
  description: "Plan, collaborate, and book top-tier event artisans with 100% milestone payment protection and collaborative family registry.",
});

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between w-full bg-[#FAF9F6]">
      <Navbar />
      <main className="flex-1 w-full pt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}

