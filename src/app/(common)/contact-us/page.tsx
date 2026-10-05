import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import ContactUsClient from "@/components/pages/info/ContactUsClient";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us | 24/7 Concierge & Hospitality Desk",
  description: "Get in touch with the Ophir hospitality concierge, artisan relations team, or escrow mediation desk.",
  canonicalUrl: "/contact-us",
});

export default function ContactUsPage() {
  return <ContactUsClient />;
}
