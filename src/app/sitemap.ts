import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ophir-events.com";
  const lastModified = new Date();

  const publicRoutes = [
    "",
    "/vendors",
    "/become-a-vendor",
    "/how-it-works",
    "/about-us",
    "/contact-us",
    "/help-center",
    "/terms",
    "/login",
    "/register",
    "/forgot-password",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/vendors" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/vendors" || route === "/become-a-vendor" ? 0.9 : 0.7,
  }));
}
