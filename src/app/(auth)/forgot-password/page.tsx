import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import ForgotPasswordClient from "@/components/pages/auth/ForgotPasswordClient";

export const metadata: Metadata = constructMetadata({
  title: "Recover Password | Ophir",
  description: "Reset and recover your Ophir host or vendor account password safely.",
  canonicalUrl: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
