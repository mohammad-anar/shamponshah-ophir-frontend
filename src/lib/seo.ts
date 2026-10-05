import type { Metadata } from "next";

export const siteConfig = {
  name: "Ophir",
  shortName: "Ophir",
  description: "The premier escrow-secured marketplace for milestone events, verified artisans, bespoke event services, and family collaborative planning.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ophir-events.com",
  ogImage: "/og-image.png",
  logo: "/logo.png",
  keywords: [
    "Milestone Events",
    "Escrow Event Marketplace",
    "Wedding Vendors",
    "Birthday Planners",
    "Event Photographers",
    "Catering & Bar Service",
    "Live Bands & DJs",
    "Floral & Event Decor",
    "FDIC Insured Escrow",
    "Collaborative Family Planning",
    "Verified Event Artisans",
    "Ophir"
  ],
  author: "Ophir Technologies Inc.",
  creator: "@ophirevents",
  publisher: "Ophir Technologies Inc.",
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
} = {}): Metadata {
  const fullTitle = title === siteConfig.name ? `${title} | The Modern Milestone & Escrow Marketplace` : `${title} | Ophir`;

  return {
    title: fullTitle,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author }],
    generator: "Next.js",
    keywords: siteConfig.keywords,
    referrer: "origin-when-cross-origin",
    creator: siteConfig.author,
    publisher: siteConfig.publisher,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl || "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl || siteConfig.url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    icons: {
      icon: [
        { url: "/logo.png", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/logo.png" }],
      shortcut: ["/logo.png"],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
