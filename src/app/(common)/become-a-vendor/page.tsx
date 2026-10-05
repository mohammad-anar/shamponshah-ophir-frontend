import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import BecomeVendorClient from "@/components/pages/info/BecomeVendorClient";

export const metadata: Metadata = constructMetadata({
  title: "Become a Ophir Vendor | Join the Verified Artisan Guild",
  description: "Expand your milestone event business. Enjoy 0% seller commission fees, instant milestone escrow release, and access high-budget family hosts.",
  canonicalUrl: "/become-a-vendor",
});

export default function BecomeVendorPage() {
  return <BecomeVendorClient />;
}
