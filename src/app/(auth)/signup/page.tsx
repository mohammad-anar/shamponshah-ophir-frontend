import React, { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import RegisterClient from "@/components/pages/auth/RegisterClient";

export const metadata: Metadata = constructMetadata({
  title: "Sign Up | Join Ophir Marketplace",
  description: "Create your free Ophir account as a client or register your artisan vendor studio.",
  canonicalUrl: "/signup",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0C0E]" />}>
      <RegisterClient />
    </Suspense>
  );
}
