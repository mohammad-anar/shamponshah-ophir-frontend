import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import AboutUsClient from "@/components/pages/info/AboutUsClient";

export const metadata: Metadata = constructMetadata({
  title: "About Us | Our Mission & Cultural Heritage Story",
  description: "We help families celebrate without financial friction. Built to honor milestone memories with guaranteed escrow protection and vetted artisans.",
  canonicalUrl: "/about-us",
});

export default function AboutUsPage() {
  return <AboutUsClient />;
}
