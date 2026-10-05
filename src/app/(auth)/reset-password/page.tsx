import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import ResetPasswordClient from "@/components/pages/auth/ResetPasswordClient";

export const metadata: Metadata = constructMetadata({
  title: "Set New Password | Ophir",
  description: "Set a strong new password for your Ophir account.",
  canonicalUrl: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
