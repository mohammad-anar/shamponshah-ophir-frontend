import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import CulturalTraditionsClient from "@/components/pages/cultural/CulturalTraditionsClient";

export const metadata: Metadata = constructMetadata({
  title: "Cultural Traditions & Heritage Celebrations | Ophir Reserve",
  description: "Discover master artisans specializing in authentic West African, South Asian, Byzantine, and heritage milestone ceremonies with full escrow milestone protection.",
  canonicalUrl: "/cultural-traditions",
});

export default function CulturalTraditionsPage() {
  return <CulturalTraditionsClient />;
}
