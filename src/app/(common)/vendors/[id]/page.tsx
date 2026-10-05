import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { VENDORS } from "@/data/mockData";
import VendorDetailClient from "@/components/pages/vendors/VendorDetailClient";

interface VendorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VendorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const vendor = VENDORS.find((v) => v.id === id);

  if (!vendor) {
    return constructMetadata({
      title: "Artisan Profile | Ophir",
      description: "Explore verified event artisan profile and portfolio on Ophir.",
      canonicalUrl: `/vendors/${id}`,
    });
  }

  return constructMetadata({
    title: `${vendor.name} — ${vendor.title}`,
    description: `${vendor.bio.substring(0, 160)}... Rated ${vendor.rating}★ with ${vendor.reviewCount} verified reviews on Ophir.`,
    image: vendor.heroImage || vendor.avatar,
    canonicalUrl: `/vendors/${id}`,
  });
}

export default function VendorDetailPage() {
  return <VendorDetailClient />;
}
