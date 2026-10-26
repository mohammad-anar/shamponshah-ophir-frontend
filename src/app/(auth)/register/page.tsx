import React, { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import RegisterClient from "@/components/pages/auth/RegisterClient";

export const metadata: Metadata = constructMetadata({
  title: "Create Account | Join Ophir Milestone Marketplace",
  description: "Create your free Ophir account as a celebration host or apply as a verified event vendor.",
  canonicalUrl: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0C0E]" />}>
      <RegisterClient />
    </Suspense>
  );
}
