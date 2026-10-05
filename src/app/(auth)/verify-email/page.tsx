import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import VerifyEmailClient from "@/components/pages/auth/VerifyEmailClient";

export const metadata: Metadata = constructMetadata({
  title: "Verify Your Email | Ophir",
  description: "Verify your email address to complete your Ophir account registration.",
  canonicalUrl: "/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
