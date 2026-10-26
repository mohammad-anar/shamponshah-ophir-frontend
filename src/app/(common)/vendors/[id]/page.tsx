import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import VendorDetailClient from "@/components/pages/vendors/VendorDetailClient";

interface VendorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VendorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`http://localhost:4005/api/v1/vendors/profile/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      const vendor = data?.data || data;
      if (vendor && vendor.name) {
        return constructMetadata({
          title: `${vendor.name} — ${vendor.title || "Master Cultural Artisan"}`,
          description: `${(vendor.bio || "Explore verified artisan portfolio on Ophir Reserve.").substring(0, 160)}... Rated ${vendor.rating || 5}★ on Ophir Reserve.`,
          image: vendor.heroImage || vendor.avatar,
          canonicalUrl: `/vendors/${id}`,
        });
      }
    }
  } catch {}

  return constructMetadata({
    title: "Artisan Profile | Ophir Reserve",
    description: "Explore verified event vendor profile, portfolio, and ceremonial packages on Ophir Reserve.",
    canonicalUrl: `/vendors/${id}`,
  });
}

export default function VendorDetailPage() {
  return <VendorDetailClient />;
}
