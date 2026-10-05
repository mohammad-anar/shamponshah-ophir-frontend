import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import HomePageClient from "@/components/pages/home/HomePageClient";

export const metadata: Metadata = constructMetadata({
  title: "Ophir | The Modern Milestone & Escrow Marketplace",
  description: "The premier escrow-secured marketplace for milestone events, verified artisans, bespoke event services, and family collaborative planning.",
  canonicalUrl: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
