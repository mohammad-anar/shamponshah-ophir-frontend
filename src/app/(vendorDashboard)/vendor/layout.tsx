"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useGetMeQuery, useResendVerificationMutation } from "@/redux/service/auth/authApi";

export default function VendorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: meData } = useGetMeQuery();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = reduxUser || meData;
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const handleResend = async () => {
    if (!user?.email || isResending) return;
    try {
      await resendVerification({ email: user.email }).unwrap();
      toast.success(`Verification email sent to ${user.email}! Please check your inbox or terminal.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend verification email.");
    }
  };

  const isUnverifiedVendor = user && user.role === "VENDOR" && user.isEmailVerified === false;

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F3F4F6] flex font-sans dashboard-theme">
      {/* Vendor Sidebar */}
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        <VendorHeader onMenuToggle={() => setSidebarOpen(true)} />

        {/* Unverified Vendor Warning Banner */}
        {isUnverifiedVendor && (
          <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-white">Unverified Vendor Account:</span>{" "}
                Please verify your email ({user.email}) to activate your account and start accepting bookings.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={isResending}
                onClick={handleResend}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
              <Link
                href={`/verify-email?email=${encodeURIComponent(user.email)}&role=vendor`}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20"
              >
                Verify Now
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
