import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import HomePageClient from "@/components/pages/home/HomePageClient";

export const metadata: Metadata = constructMetadata({
  title: "Ophir Reserve | Curated Culture. Exceptional Connections.",
  description: "The private reserve of vetted cultural artisans, master caterers, and milestone celebrations with guaranteed milestone escrow protection.",
  canonicalUrl: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
