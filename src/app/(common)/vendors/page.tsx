import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import VendorsDirectoryClient from "@/components/pages/vendors/VendorsDirectoryClient";

export const metadata: Metadata = constructMetadata({
  title: "Verified Event Artisans & Vendors Directory",
  description: "Browse vetted wedding photographers, caterers, live bands, DJs, florists, and milestone event specialists. 100% escrow milestone protection.",
  canonicalUrl: "/vendors",
});

export default function VendorsPage() {
  return <VendorsDirectoryClient />;
}
