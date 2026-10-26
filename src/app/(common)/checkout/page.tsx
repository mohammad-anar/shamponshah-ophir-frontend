"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetPaymentMethodsQuery, useCreatePaymentIntentMutation } from "@/redux/service/payments/paymentsApi";
import { useCreateOrderMutation, useGetOrderByIdQuery } from "@/redux/service/orders/ordersApi";
import { useGetVendorBySlugQuery } from "@/redux/service/vendors/vendorsApi";
import { useUpdateBoardItemMutation } from "@/redux/service/family-hub/familyHubApi";
import StripePaymentModal from "@/components/payment/StripePaymentModal";

export default function CheckoutBookingPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId") || "";
  const packageId = searchParams.get("packageId");
  const existingOrderId = searchParams.get("orderId") || "";

  const { data: apiVendorResp } = useGetVendorBySlugQuery(vendorId, {
    skip: !vendorId,
  });
  const { data: existingOrderResp } = useGetOrderByIdQuery(existingOrderId, { skip: !existingOrderId });

  const { data: savedMethodsData } = useGetPaymentMethodsQuery();
  const [createOrder] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [updateBoardItem] = useUpdateBoardItemMutation();

  const existingOrder = existingOrderResp?.data || existingOrderResp;
  const liveVendor = apiVendorResp?.data || apiVendorResp || existingOrder?.vendorProfile;

  const vendor = {
    id: liveVendor?.id || "",
    name: liveVendor?.businessName || liveVendor?.name || "",
    avatar: liveVendor?.avatar || liveVendor?.profileImage || "",
    location: liveVendor?.location || liveVendor?.city || "",
    packages: liveVendor?.gigs?.[0]?.packages || liveVendor?.packages || [],
  };

  const selectedPkg = existingOrder
    ? (existingOrder.package || existingOrder.gig?.packages?.[0] || { id: existingOrder.packageId, title: existingOrder.gig?.title || existingOrder.job?.title || "Accepted proposal", price: existingOrder.subtotal })
    : packageId 
    ? (vendor.packages.find((p: any) => p.id === packageId) || vendor.packages[0])
    : vendor.packages[0];

  const savedMethods = savedMethodsData?.data || savedMethodsData || [];

  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>("");
  const [eventDate, setEventDate] = useState("2026-11-18");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [confirmedChargeAmount, setConfirmedChargeAmount] = useState(0);

  const [paymentModalOrder, setPaymentModalOrder] = useState<{ id: string; orderNumber?: string; amount: number } | null>(null);

  useEffect(() => {
    if (!selectedSavedCardId && savedMethods.length) {
      const defaultMethod = savedMethods.find((method: any) => method.isDefault) || savedMethods[0];
      setSelectedSavedCardId(defaultMethod.stripePaymentMethodId || defaultMethod.id);
    }
  }, [savedMethods, selectedSavedCardId]);

  const basePackagePrice = Number(existingOrder?.subtotal ?? selectedPkg?.price ?? 0);
  const subtotal = basePackagePrice;
  const platformFee = subtotal * 0.15; // 15% platform fee
  const vendorNet = subtotal * 0.85; // 85% vendor net
  const grandTotal = subtotal + platformFee;

  const configuredMilestones = Array.isArray(selectedPkg?.escrowSplitJson)
    ? selectedPkg.escrowSplitJson
    : selectedPkg?.escrowSplitJson?.milestones || [];
  const firstLockedMilestone = existingOrder?.milestones?.find((milestone: any) => milestone.status === "LOCKED");
  const firstMilestonePercent = existingOrder && subtotal > 0
    ? (Number(firstLockedMilestone?.amount || 0) / subtotal) * 100
    : configuredMilestones[0]?.percentage || 50;
  const milestone1 = Number(firstLockedMilestone?.amount ?? subtotal * Number(firstMilestonePercent) / 100);

  const handleConfirmEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingOrderId && !selectedPkg?.id) {
      toast.error("Choose an available service package before booking.");
      return;
    }
    if (!selectedSavedCardId) {
      toast.error("Add and select a payment method before booking.");
      return;
    }
    if (existingOrderId && !existingOrder) {
      toast.error("The accepted order is still loading or could not be found. Refresh and try again.");
      return;
    }
    setIsProcessing(true);

    try {
      const orderRes = existingOrderId ? null : await createOrder({
        packageId: selectedPkg?.id,
        eventDate: new Date(eventDate).toISOString(),
        deliveryNotes: `Package: ${selectedPkg.title || "Service package"}`,
      }).unwrap();

      const order = existingOrderId ? existingOrder : (orderRes?.data || orderRes);
      if (!order?.id) throw new Error("Order could not be created");
      const payment = await createPaymentIntent({ orderId: order.id, paymentMethodId: selectedSavedCardId }).unwrap();
      let paymentStatus = payment.paymentStatus;
      if (["requires_action", "requires_confirmation"].includes(paymentStatus)) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey || !window.Stripe) throw new Error("Card authentication is unavailable. Please contact support.");
        const result = await window.Stripe(publishableKey).confirmCardPayment(payment.clientSecret);
        if (result.error) throw new Error(result.error.message || "Payment authentication failed");
        paymentStatus = result.paymentIntent?.status;
      }
      if (paymentStatus !== "succeeded") throw new Error("Payment is not confirmed yet. Check your orders before trying again.");
      const familyBoardItemId = searchParams.get("familyBoardItemId");
      if (familyBoardItemId) {
        try {
          await updateBoardItem({ itemId: familyBoardItemId, data: { status: "BOOKED" } }).unwrap();
        } catch {
          toast.error("Payment succeeded, but the Family Hub item could not be updated. Contact support with your order number.");
        }
      }
      setConfirmedOrderNumber(order.orderNumber || order.id);
      setConfirmedChargeAmount(Number(payment.amount || milestone1 + platformFee * milestone1 / subtotal));
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("First milestone payment confirmed.", { description: "Order activation will appear after Stripe confirms the webhook." });
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error?.data?.message || error?.message || "Payment failed. Your order has not started.");
    }
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stripe Connect Checkout</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight mt-1">
              Secure Milestone Gig Booking
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              âœ“ Step 1: Package
            </span>
            <span>â†’</span>
            <span className="text-obsidian bg-white px-2.5 py-1 rounded-md border border-slate-300">
              Step 2: Payment
            </span>
          </div>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleConfirmEscrow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Package breakdown, Addons, Milestone Release Roadmap */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vendor & Package Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border border-[#EAE6DF] space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs border-2 border-white bg-slate-100 flex-shrink-0">
                    <Image
                      src={vendor.avatar}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-obsidian">
                      {selectedPkg?.title || vendor.packages[0]?.title || "Milestone Vendor Package"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Vendor: <span className="font-semibold text-obsidian">{vendor.name}</span> â€¢ {vendor.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE6DF] text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">EVENT DATE</span>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="font-bold text-obsidian bg-transparent focus:outline-none mt-0.5 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">COVERAGE</span>
                    <span className="font-bold text-obsidian">6 Hours Continuous</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">TURNAROUND</span>
                    <span className="font-bold text-emerald-600">48-Hr Sneak Peek</span>
                  </div>
                </div>
              </div>

              {/* Milestone payment terms */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border border-[#EAE6DF] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-obsidian">
                    Milestone payments
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Approval required
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2 text-sm">
                  <p className="font-semibold text-obsidian">
                    First payment today: {firstMilestonePercent}% (${milestone1.toFixed(2)} before the platform fee)
                  </p>
                  <p className="text-xs text-slate-600">
                    Later milestones are charged before that stage begins. After you approve delivery, the vendor transfer is scheduled 7 days later. A dispute pauses the transfer.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Order Summary & Payment Method */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury-lg border border-[#EAE6DF] space-y-6">
                <h3 className="font-serif font-bold text-xl text-obsidian">
                  Milestone Payment Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-b border-[#EAE6DF] pb-4">
                  <div className="flex justify-between">
                    <span>Base Package Fee</span>
                    <span className="font-bold text-obsidian">${basePackagePrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Platform fee</span>
                    <span className="font-bold text-obsidian">+${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-obsidian">
                    <span>First milestone due today (before fee)</span>
                    <span>${milestone1.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      ORDER TOTAL
                    </span>
                    <span className="font-serif text-3xl font-extrabold text-obsidian">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    Stripe charges the first milestone and its allocated platform fee today.
                  </span>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Choose a saved payment method
                    </label>
                    {savedMethods.length > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {savedMethods.length} Saved Card{savedMethods.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {savedMethods.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {savedMethods.map((pm: any) => (
                        <div
                          key={pm.id}
                          onClick={() => {
                            setSelectedSavedCardId(pm.stripePaymentMethodId || pm.id);
                          }}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs",
                            selectedSavedCardId === (pm.stripePaymentMethodId || pm.id)
                              ? "border-brand-primary bg-indigo-50/50 shadow-2xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[9px] font-bold uppercase">
                              {pm.brand || "Card"}
                            </span>
                            <span className="font-mono font-bold text-slate-800">
                              â€¢â€¢â€¢â€¢ {pm.last4 || "4242"}
                            </span>
                            {pm.isDefault && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                            {selectedSavedCardId === (pm.stripePaymentMethodId || pm.id) && (
                              <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!savedMethods.length && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <span>A verified payment method must be saved to your account before placing or booking an order.</span>
                      <Link
                        className="px-3 py-1.5 rounded-lg bg-amber-900 text-white font-bold text-xs whitespace-nowrap text-center hover:bg-amber-950 transition-colors"
                        href="/user/payments"
                      >
                        Add Card First →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Direct Custom PaymentElement Form Action */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!existingOrderId && !selectedPkg?.id) {
                      toast.error("Choose an available service package before booking.");
                      return;
                    }
                    setIsProcessing(true);
                    try {
                      const orderRes = existingOrderId ? null : await createOrder({
                        packageId: selectedPkg?.id,
                        eventDate: new Date(eventDate).toISOString(),
                        deliveryNotes: `Package: ${selectedPkg.title || "Service package"}`,
                        amount: grandTotal,
                        source: "GIG",
                      }).unwrap();

                      const order = existingOrderId ? existingOrder : (orderRes?.data || orderRes);
                      if (!order?.id) throw new Error("Order creation failed");

                      setPaymentModalOrder({
                        id: order.id,
                        orderNumber: order.orderNumber,
                        amount: grandTotal,
                      });
                      setIsProcessing(false);
                    } catch (err: any) {
                      setIsProcessing(false);
                      toast.error(err?.data?.message || err?.message || "Could not prepare order for payment");
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full h-14 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 active:scale-99 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Pay with Stripe PaymentElement (${grandTotal.toFixed(2)})</span>
                </button>

                {/* Submit Escrow Button using Saved Card if available */}
                {savedMethods.length > 0 && (
                  <button
                    type="submit"
                    disabled={isProcessing || !selectedSavedCardId}
                    className="w-full h-12 bg-[#1A1F40] hover:bg-[#252B56] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Quick Pay with Saved Card</span>
                      </>
                    )}
                  </button>
                )}

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Full amount is held in Ophir Escrow Vault (15% platform fee, 85% vendor net). Funds are protected until you approve completed delivery.
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-luxury-lg border border-emerald-200 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                PAYMENT CONFIRMED - ORDER #{confirmedOrderNumber}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian">
                Your first milestone payment is confirmed.
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                <span className="font-bold text-obsidian">${confirmedChargeAmount.toFixed(2)}</span> was charged for the first milestone, including its platform fee. The order status updates after Stripe confirms the payment webhook.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor:</span>
                <span className="font-bold text-obsidian">{vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Date:</span>
                <span className="font-bold text-obsidian">{eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">First milestone:</span>
                <span className="font-bold text-emerald-600">${milestone1.toFixed(2)} funded</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/user/orders"
                className="w-full sm:w-auto px-6 py-3 bg-[#0F1228] text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                View my orders
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-[#F4F2EE] text-slate-800 font-semibold text-xs rounded-xl"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {/* Custom Stripe PaymentElement Modal */}
        {paymentModalOrder && (
          <StripePaymentModal
            isOpen={!!paymentModalOrder}
            onClose={() => setPaymentModalOrder(null)}
            orderId={paymentModalOrder.id}
            orderNumber={paymentModalOrder.orderNumber}
            amount={paymentModalOrder.amount}
            onSuccess={(data) => {
              setPaymentModalOrder(null);
              setConfirmedOrderNumber(data.orderNumber || paymentModalOrder.orderNumber || paymentModalOrder.id);
              setConfirmedChargeAmount(Number(data.amount || paymentModalOrder.amount));
              setIsSuccess(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
