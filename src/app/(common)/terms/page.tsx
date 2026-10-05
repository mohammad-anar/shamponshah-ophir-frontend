import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import TermsClient from "@/components/pages/info/TermsClient";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service & Escrow Governance Protocol",
  description: "Official legal terms, escrow custody rules, dispute arbitration timelines, and user compliance agreements for Ophir.",
  canonicalUrl: "/terms",
});

export default function TermsPage() {
  return <TermsClient />;
}
