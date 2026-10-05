import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import HowItWorksClient from "@/components/pages/info/HowItWorksClient";

export const metadata: Metadata = constructMetadata({
  title: "How It Works | Milestone Escrow & Collaborative Planning Protocol",
  description: "Learn how Ophir replaces wire transfer chaos with secure FDIC-insured milestone escrow, family collaborative planning, and verified vendor vetting.",
  canonicalUrl: "/how-it-works",
});

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
