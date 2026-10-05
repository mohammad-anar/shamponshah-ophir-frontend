import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import HelpCenterClient from "@/components/pages/info/HelpCenterClient";

export const metadata: Metadata = constructMetadata({
  title: "Help Center & Escrow FAQ | Support Knowledgebase",
  description: "Find answers regarding escrow payments, milestone release protocols, vendor background vetting, and family collaboration.",
  canonicalUrl: "/help-center",
});

export default function HelpCenterPage() {
  return <HelpCenterClient />;
}
