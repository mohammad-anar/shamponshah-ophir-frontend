import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import LoginClient from "@/components/pages/auth/LoginClient";

export const metadata: Metadata = constructMetadata({
  title: "Sign In to Ophir | Client & Vendor Portal",
  description: "Sign in to your Ophir account to manage milestone events, message verified artisans, or access your seller dashboard.",
  canonicalUrl: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginClient />;
}
