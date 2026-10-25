"use client";

import {
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetStripeStatusQuery,
  useConnectStripeMutation,
  useLazyGetStripePortalQuery,
} from "@/redux/service/payments/paymentsApi";

export default function VendorPayoutSettingsPage() {
  const { data: stripeStatusData, isLoading: isStatusLoading } = useGetStripeStatusQuery();
  const [connectStripe, { isLoading: isConnecting }] = useConnectStripeMutation();
  const [triggerGetPortal, { isFetching: isPortalLoading }] = useLazyGetStripePortalQuery();

  const stripeStatus = stripeStatusData?.data || stripeStatusData || {};
  const isConnected = !!stripeStatus.connected;
  const payoutsEnabled = !!stripeStatus.payoutsEnabled;

  const handleConnectStripe = async () => {
    try {
      const res = await connectStripe().unwrap();
      const onboardingUrl = (res as any)?.data?.url || (res as any)?.url;
      if (onboardingUrl) {
        toast.info("Redirecting to Stripe Express onboarding...");
        window.location.assign(onboardingUrl);
      } else {
        toast.error("Could not obtain Stripe onboarding link");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initialize Stripe Connect");
    }
  };

  const handleOpenStripePortal = async () => {
    try {
      toast.info("Generating Stripe Express login session...");
      const res = await triggerGetPortal().unwrap();
      const portalUrl = (res as any)?.data?.url || (res as any)?.url;
      if (portalUrl) {
        window.location.assign(portalUrl);
      } else {
        toast.error("Stripe did not return an account portal link.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not open Stripe Express.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Stripe Connect payout settings
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isConnected
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isConnected ? "Stripe Connect Active" : "Stripe Setup Pending"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete identity verification and manage your payout account through Stripe Express.
          </p>
        </div>

      </div>

      {/* Stripe Connect Banner */}
      <div className="bg-[#0F0C3B] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span>Stripe Connect Express</span>
              {isConnected && (
                <span className="text-[10px] font-mono px-2 py-0.2 bg-white/20 rounded">
                  Connected
                </span>
              )}
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              {isConnected
                ? "Milestone transfers arrive in your connected Stripe balance. Bank payout timing is controlled by Stripe."
                : "Complete Stripe Connect onboarding to receive marketplace transfers."}
            </p>
          </div>
        </div>

        {isConnected ? (
          <button
            onClick={handleOpenStripePortal}
            disabled={isPortalLoading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            Stripe Portal <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleConnectStripe}
            disabled={isConnecting || isStatusLoading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            <span>Connect Stripe Account</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#0F0C3B]">Bank and payout details</h2>
        <p className="text-xs text-slate-600">
          Add or update bank details in Stripe Express. This marketplace does not collect or store bank account or routing numbers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-slate-500">Transfer capability</span>
            <strong className="text-[#0F0C3B]">{stripeStatus.transfersEnabled ? "Enabled" : "Setup required"}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-slate-500">Bank payouts</span>
            <strong className="text-[#0F0C3B]">{payoutsEnabled ? "Enabled" : "Setup required"}</strong>
          </div>
        </div>
        {stripeStatus.requirements?.currently_due?.length > 0 && (
          <p className="text-xs text-amber-700">
            Stripe needs more information: {stripeStatus.requirements.currently_due.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
