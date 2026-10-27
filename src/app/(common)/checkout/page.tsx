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
  CreditCard,
  Calendar,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetPaymentMethodsQuery,
  useCreatePaymentIntentMutation,
  usePayOrderMutation,
} from "@/redux/service/payments/paymentsApi";
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
  const [payOrder] = usePayOrderMutation();
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

  const [paymentMode, setPaymentMode] = useState<"card" | "saved">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>("");
  const [eventDate, setEventDate] = useState("2026-11-18");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [confirmedChargeAmount, setConfirmedChargeAmount] = useState(0);

  const [paymentModalOrder, setPaymentModalOrder] = useState<{ id: string; orderNumber?: string; amount: number } | null>(null);

  useEffect(() => {
    if (savedMethods.length > 0) {
      if (!selectedSavedCardId) {
        const defaultMethod = savedMethods.find((method: any) => method.isDefault) || savedMethods[0];
        setSelectedSavedCardId(defaultMethod.stripePaymentMethodId || defaultMethod.id);
      }
    } else {
      setPaymentMode("card");
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^6(?:011|5)/.test(clean)) return "DISCOVER";
    return "CARD";
  };

  const handleConfirmEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingOrderId && !selectedPkg?.id) {
      toast.error("Choose an available service package before booking.");
      return;
    }

    if (paymentMode === "saved" && !selectedSavedCardId) {
      toast.error("Please select a saved payment card or switch to enter card details.");
      return;
    }

    if (paymentMode === "card") {
      const cleanNum = cardNumber.replace(/\D/g, "");
      if (cleanNum.length < 12) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 4) {
        toast.error("Please enter a valid card expiration date (MM/YY).");
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        toast.error("Please enter a valid 3 or 4-digit CVC code.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      let orderId = existingOrderId;
      let orderNum = existingOrder?.orderNumber;

      if (!orderId) {
        const orderRes = await createOrder({
          packageId: selectedPkg?.id,
          eventDate: new Date(eventDate).toISOString(),
          deliveryNotes: `Package: ${selectedPkg.title || "Service package"}`,
          amount: grandTotal,
          source: "GIG",
        }).unwrap();

        const order = orderRes?.data || orderRes;
        if (!order?.id) throw new Error("Order creation failed");
        orderId = order.id;
        orderNum = order.orderNumber;
      }

      // Process payment with either direct card or selected saved card
      const payRes = await payOrder({
        orderId,
        paymentMethodId: paymentMode === "saved" ? selectedSavedCardId : undefined,
        cardNumber: paymentMode === "card" ? cardNumber : undefined,
        cardExpiry: paymentMode === "card" ? cardExpiry : undefined,
        cardCvc: paymentMode === "card" ? cardCvc : undefined,
        cardholderName: paymentMode === "card" ? (cardholderName || "Verified Cardholder") : undefined,
        saveCard: paymentMode === "card" ? saveCard : undefined,
      }).unwrap();

      const familyBoardItemId = searchParams.get("familyBoardItemId");
      if (familyBoardItemId) {
        try {
          await updateBoardItem({ itemId: familyBoardItemId, data: { status: "BOOKED" } }).unwrap();
        } catch {
          // Non-fatal
        }
      }

      setConfirmedOrderNumber(payRes.orderNumber || orderNum || orderId);
      setConfirmedChargeAmount(Number(payRes.amount || grandTotal));
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment confirmed & secured in Escrow Vault!", {
        description: `Order #${payRes.orderNumber || orderNum || orderId} is now active. Vendor notified.`,
      });
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error?.data?.message || error?.message || "Payment could not be processed. Please check your card information.");
    }
  };

  return (
    <div className="w-full bg-background text-foreground min-h-screen py-10 lg:py-16 font-sans selection:bg-brand selection:text-on-brand">
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/15">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-sunken text-brand text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stripe Connect Escrow Checkout</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight mt-1">
              Secure Milestone Gig Booking
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
            <span className="text-success bg-success-soft text-success px-3 py-1.5 rounded-lg border border-success/30 inline-flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              Step 1: Package
            </span>
            <span className="text-foreground-muted">→</span>
            <span className="text-warning bg-warning-soft text-warning px-3 py-1.5 rounded-lg border border-warning/30 font-bold">
              Step 2: Payment
            </span>
          </div>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleConfirmEscrow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Package breakdown, Addons, Milestone Release Roadmap */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vendor & Package Card */}
              <div className="bg-surface-sunken rounded-3xl p-6 sm:p-7 shadow-luxury border border-border space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs border-2 border-border-strong bg-surface-sunken flex-shrink-0">
                    <Image
                      src={vendor.avatar || "/placeholder-avatar.png"}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      {selectedPkg?.title || vendor.packages[0]?.title || "Milestone Vendor Package"}
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      Vendor: <span className="font-semibold text-warning">{vendor.name}</span> • {vendor.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-surface-sunken rounded-2xl border border-border text-xs">
                  <div>
                    <span className="text-foreground-muted block text-[10px] uppercase font-bold">EVENT DATE</span>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="font-bold text-foreground bg-transparent focus:outline-none mt-0.5 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-foreground-muted block text-[10px] uppercase font-bold">COVERAGE</span>
                    <span className="font-bold text-foreground">Continuous Dedicated</span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block text-[10px] uppercase font-bold">ESCROW VAULT</span>
                    <span className="font-bold text-success">100% Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Milestone payment terms */}
              <div className="bg-surface-sunken rounded-3xl p-6 sm:p-7 shadow-luxury border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-foreground">
                    Milestone Security & Protection
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success-soft text-success border border-success/30 px-2.5 py-1 rounded-full">
                    Approval required
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-sunken border border-border space-y-2 text-sm text-foreground-secondary">
                  <p className="font-semibold text-foreground">
                    Escrow Deposit Today: ${grandTotal.toFixed(2)} held safely in vault
                  </p>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    Funds are secured under escrow contracts. The vendor begins work immediately. Payout is released to the vendor only after you inspect and approve completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Order Summary & Interactive Payment Inputs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface-sunken rounded-3xl p-6 sm:p-7 shadow-luxury-lg border border-border space-y-6">
                <h3 className="font-serif font-bold text-xl text-foreground">
                  Payment & Escrow Authorization
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-foreground-secondary border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span>Base Package Fee</span>
                    <span className="font-bold text-foreground">${basePackagePrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Platform Escrow Fee (15%)</span>
                    <span className="font-bold text-foreground-secondary">+${platformFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-foreground-muted block font-medium">
                      TOTAL ESCROW DEPOSIT
                    </span>
                    <span className="font-serif text-3xl font-extrabold text-warning">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-success bg-success-soft text-success border border-success/30 px-2.5 py-1 rounded-full">
                    Protected in Vault
                  </span>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-foreground-secondary">
                      Select Payment Method
                    </label>
                    <span className="text-[10px] font-mono text-success flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> 256-bit SSL
                    </span>
                  </div>

                  {/* Tabs: Card vs Saved Methods */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-surface-sunken rounded-xl border border-border text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("card")}
                      className={cn(
                        "py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        paymentMode === "card"
                          ? "bg-warning-solid text-on-brand text-on-brand shadow-sm"
                          : "text-foreground-muted hover:text-foreground"
                      )}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Credit / Debit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode("saved")}
                      disabled={savedMethods.length === 0}
                      className={cn(
                        "py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                        paymentMode === "saved"
                          ? "bg-warning-solid text-on-brand text-on-brand shadow-sm"
                          : "text-foreground-muted hover:text-foreground"
                      )}
                    >
                      <span>Saved Cards ({savedMethods.length})</span>
                    </button>
                  </div>

                  {/* Direct Card Input Fields */}
                  {paymentMode === "card" && (
                    <div className="p-4 rounded-2xl bg-surface-sunken border border-border space-y-3.5">
                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-foreground-secondary mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="Full name on card"
                          className="w-full bg-surface-sunken border border-border-strong/15 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-warning/30"
                        />
                      </div>

                      {/* Card Number */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-foreground-secondary">
                            Card Number
                          </label>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warning-solid text-on-brand/20 text-warning border border-warning/30">
                            {getCardBrand(cardNumber)}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-surface-sunken border border-border-strong/15 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-warning/30 tracking-wider"
                          />
                          <CreditCard className="w-4 h-4 text-foreground-muted absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Expiry & CVC Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-foreground-secondary mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            placeholder="MM/YY"
                            className="w-full bg-surface-sunken border border-border-strong/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center font-bold text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-warning/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-foreground-secondary mb-1">
                            Security Code (CVC)
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              maxLength={4}
                              placeholder="CVC"
                              className="w-full bg-surface-sunken border border-border-strong/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center font-bold text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-warning/30 tracking-widest"
                            />
                            <Lock className="w-3 h-3 text-foreground-muted absolute right-3 top-3.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Save Card Checkbox */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="saveCardCheckbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <label htmlFor="saveCardCheckbox" className="text-[11px] text-foreground-secondary cursor-pointer select-none">
                          Save card securely for future payments &amp; 1-click checkout
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Saved Cards Selection List */}
                  {paymentMode === "saved" && (
                    <div className="space-y-2">
                      {savedMethods.map((pm: any) => (
                        <div
                          key={pm.id}
                          onClick={() => {
                            setSelectedSavedCardId(pm.stripePaymentMethodId || pm.id);
                          }}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs",
                            selectedSavedCardId === (pm.stripePaymentMethodId || pm.id)
                              ? "border-warning/30 bg-warning-solid text-on-brand/10 shadow-xs"
                              : "border-border bg-surface-sunken hover:border-border-strong"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 bg-surface-sunken text-warning rounded text-[10px] font-bold uppercase border border-border">
                              {pm.brand || "Card"}
                            </span>
                            <span className="font-mono font-bold text-foreground">
                              •••• {pm.last4 || "4242"}
                            </span>
                            {pm.isDefault && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-950 text-success border border-success/30 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="w-4 h-4 rounded-full border border-border-strong/30 flex items-center justify-center">
                            {selectedSavedCardId === (pm.stripePaymentMethodId || pm.id) && (
                              <div className="w-2 h-2 rounded-full bg-warning-solid text-on-brand" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Escrow Authorization Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-gradient-to-r from-brand via-brand to-brand-active hover:from-brand hover:to-brand-active active:scale-99 disabled:opacity-50 disabled:cursor-not-allowed text-on-brand font-bold text-sm rounded-xl shadow-xl shadow-gold-glow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Authorizing Escrow Deposit...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-on-brand" />
                      <span>Confirm &amp; Deposit ${grandTotal.toFixed(2)} in Escrow</span>
                    </>
                  )}
                </button>

                {/* Secondary Option: Stripe Modal */}
                <div className="text-center pt-1">
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
                    className="text-[11px] text-foreground-muted hover:text-warning transition-colors underline cursor-pointer"
                  >
                    Or open full Stripe PaymentElement popup
                  </button>
                </div>

                <p className="text-[11px] text-foreground-muted text-center leading-relaxed">
                  Full amount is held in Ophir Escrow Vault (15% platform fee, 85% vendor net). Funds are protected until you approve completed delivery.
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="max-w-2xl mx-auto bg-surface-sunken rounded-3xl p-8 sm:p-12 shadow-luxury-lg border border-success/30 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-success-solid text-foreground/20 text-success border border-success/30 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-success uppercase tracking-wider bg-success-soft text-success border border-success/30 px-3 py-1 rounded-full">
                PAYMENT CONFIRMED - ORDER #{confirmedOrderNumber}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Your escrow payment is confirmed.
              </h2>
              <p className="text-sm text-foreground-secondary max-w-md mx-auto">
                <span className="font-bold text-warning">${confirmedChargeAmount.toFixed(2)}</span> has been securely deposited into the Ophir Escrow Vault. The order is now <span className="font-bold text-success">ACTIVE</span>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-sunken border border-border text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Vendor:</span>
                <span className="font-bold text-foreground">{vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Event Date:</span>
                <span className="font-bold text-foreground">{eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Escrow Security:</span>
                <span className="font-bold text-success">Protected until delivery sign-off</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/user/orders"
                className="w-full sm:w-auto px-6 py-3 bg-warning-solid text-on-brand hover:bg-warning-solid text-on-brand text-on-brand font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                View my orders
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-surface/10 hover:bg-surface/15 text-foreground font-semibold text-xs rounded-xl transition-colors"
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
