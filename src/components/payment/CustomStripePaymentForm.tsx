"use client";

import React, { useState, useEffect, useMemo } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Sparkles,
} from "lucide-react";
import {
  useCreateOrderPaymentIntentMutation,
  useConfirmOrderPaymentMutation,
} from "@/redux/service/payments/paymentsApi";
import { toast } from "sonner";
import Link from "next/link";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
let stripePromise: Promise<Stripe | null> | null = null;
if (stripePublicKey) {
  stripePromise = loadStripe(stripePublicKey);
}

interface CustomStripePaymentFormProps {
  orderId: string;
  orderNumber?: string;
  amount?: number;
  onSuccess?: (confirmedData: any) => void;
  onCancel?: () => void;
  className?: string;
}

// ── Embedded Form Child (Inside Elements context) ───────────
function CheckoutFormInner({
  orderId,
  orderNumber,
  totalAmount,
  platformFee,
  vendorNet,
  idempotencyKey,
  onSuccess,
}: {
  orderId: string;
  orderNumber?: string;
  totalAmount: number;
  platformFee: number;
  vendorNet: number;
  idempotencyKey: string;
  onSuccess?: (data: any) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  const [confirmOrderPayment] = useConfirmOrderPaymentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is initializing, please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe PaymentElement (no redirect unless 3DS required)
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment authentication failed");
        toast.error(error.message || "Payment failed");
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Idempotent order confirmation on our platform
        const confirmRes = await confirmOrderPayment({
          orderId,
          paymentIntentId: paymentIntent.id,
          idempotencyKey,
        }).unwrap();

        setSuccessDetails({
          orderId,
          orderNumber: confirmRes.orderNumber || orderNumber || orderId,
          amount: confirmRes.amount || totalAmount,
          platformFee: confirmRes.platformFee || platformFee,
          vendorNet: confirmRes.vendorNet || vendorNet,
          paymentIntentId: paymentIntent.id,
        });

        setIsSuccess(true);
        toast.success("Payment secured in escrow vault!", {
          description: "Order is now ACTIVE. Funds are securely protected.",
        });

        if (onSuccess) {
          onSuccess(confirmRes);
        }
      } else {
        setErrorMessage(`Payment status: ${paymentIntent?.status || "Incomplete"}`);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Payment processing failed";
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  // ── Success State Screen ──────────────────────────────────
  if (isSuccess && successDetails) {
    return (
      <div className="bg-[#0b0a17] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold tracking-wider text-emerald-400 uppercase mb-2">
            <Lock className="w-3 h-3" /> Escrow Vault Secured
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payment Confirmed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2">
            Your payment is held in Ophir's escrow vault and will only be released after you approve the completed delivery.
          </p>

          <div className="w-full max-w-md bg-[#131127] border border-white/10 rounded-xl p-4 my-6 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Order Number:</span>
              <span className="font-mono font-bold text-amber-400">{successDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Order Status:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                ACTIVE
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Platform Escrow Fee (15%):</span>
              <span className="font-semibold text-slate-300">${Number(successDetails.platformFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Vendor Net Protected (85%):</span>
              <span className="font-semibold text-emerald-400">${Number(successDetails.vendorNet || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 font-bold text-sm text-white">
              <span>Total Charged:</span>
              <span className="text-base text-amber-300">${Number(successDetails.amount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <Link
              href={`/user/orders/${orderId}`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              View Order Progress <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment Form ──────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-[#131127] border border-white/10 rounded-xl p-4 space-y-2 text-xs text-white">
        <div className="flex items-center justify-between text-slate-300">
          <span>Order Reference</span>
          <span className="font-mono font-bold text-amber-400">#{orderNumber || orderId.slice(0, 8)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Platform Escrow Fee (15%)</span>
          <span className="font-semibold text-slate-400">${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Vendor Net Guaranteed (85%)</span>
          <span className="font-semibold text-emerald-400">${vendorNet.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold text-sm">
          <span>Total Payable</span>
          <span className="text-base text-amber-300">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-[#131127] border border-white/10 rounded-xl p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Securing Escrow Deposit...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay &amp; Deposit ${totalAmount.toFixed(2)} in Escrow</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-end 256-bit encrypted via Stripe Connect Escrow</span>
      </div>
    </form>
  );
}

// ── Main Wrapper Component ───────────────────────────────────
export default function CustomStripePaymentForm({
  orderId,
  orderNumber,
  amount = 0,
  onSuccess,
  onCancel,
  className = "",
}: CustomStripePaymentFormProps) {
  const [createOrderPaymentIntent] = useCreateOrderPaymentIntentMutation();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(amount);
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [vendorNet, setVendorNet] = useState<number>(0);
  const [resolvedOrderNumber, setResolvedOrderNumber] = useState<string | undefined>(orderNumber);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Generate a client-side idempotency key for this payment intent request
  const idempotencyKey = useMemo(() => {
    return `pi-${orderId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }, [orderId]);

  useEffect(() => {
    let isMounted = true;

    async function initPaymentIntent() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await createOrderPaymentIntent({
          orderId,
          idempotencyKey,
        }).unwrap();

        if (isMounted) {
          setClientSecret(res.clientSecret);
          setTotalAmount(res.amount);
          setPlatformFee(res.platformFee);
          setVendorNet(res.vendorNet);
          if (res.orderNumber) {
            setResolvedOrderNumber(res.orderNumber);
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          const msg = err?.data?.message || err?.message || "Failed to initialize payment intent";
          setLoadError(msg);
          setIsLoading(false);
        }
      }
    }

    if (orderId) {
      initPaymentIntent();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId, idempotencyKey, createOrderPaymentIntent]);

  const appearance = useMemo(() => ({
    theme: "night" as const,
    variables: {
      colorPrimary: "#d4af37",
      colorBackground: "#0d0c1d",
      colorText: "#f8fafc",
      colorDanger: "#ef4444",
      fontFamily: "Inter, sans-serif",
      borderRadius: "10px",
    },
    rules: {
      ".Input": {
        backgroundColor: "#16142e",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      },
      ".Input:focus": {
        border: "1px solid #d4af37",
        boxShadow: "0 0 0 1px #d4af37",
      },
      ".Label": {
        color: "#94a3b8",
        fontSize: "12px",
        fontWeight: "600",
      },
    },
  }), []);

  if (!stripePublicKey) {
    return (
      <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
        Stripe publishable key is not configured in the environment. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10 rounded-2xl bg-[#0f0e21] border border-white/10 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span>Initializing secure escrow payment vault...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>Payment Error</span>
        </div>
        <p>{loadError}</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance,
        }}
      >
        <CheckoutFormInner
          orderId={orderId}
          orderNumber={resolvedOrderNumber}
          totalAmount={totalAmount}
          platformFee={platformFee}
          vendorNet={vendorNet}
          idempotencyKey={idempotencyKey}
          onSuccess={onSuccess}
        />
      </Elements>
    </div>
  );
}
