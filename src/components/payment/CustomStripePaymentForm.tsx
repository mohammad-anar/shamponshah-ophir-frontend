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
      <div className="bg-background border border-success/30 rounded-2xl p-6 sm:p-8 text-center text-foreground relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-success-solid text-foreground/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-warning-solid text-on-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-success-solid text-foreground/20 border border-success/30 flex items-center justify-center mb-4 text-success shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft text-success border border-success/30 text-[11px] font-bold tracking-wider text-success uppercase mb-2">
            <Lock className="w-3 h-3" /> Escrow Vault Secured
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Payment Confirmed
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-md mt-2">
            Your payment is held in Ophir's escrow vault and will only be released after you approve the completed delivery.
          </p>

          <div className="w-full max-w-md bg-surface-elevated border border-border rounded-xl p-4 my-6 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-foreground-muted font-medium">Order Number:</span>
              <span className="font-mono font-bold text-warning">{successDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-foreground-muted font-medium">Order Status:</span>
              <span className="px-2 py-0.5 rounded-md bg-info-solid text-foreground/20 text-info font-bold uppercase tracking-wider text-[10px]">
                ACTIVE
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-foreground-muted font-medium">Platform Escrow Fee (15%):</span>
              <span className="font-semibold text-foreground-secondary">${Number(successDetails.platformFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-foreground-muted font-medium">Vendor Net Protected (85%):</span>
              <span className="font-semibold text-success">${Number(successDetails.vendorNet || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 font-bold text-sm text-foreground">
              <span>Total Charged:</span>
              <span className="text-base text-warning">${Number(successDetails.amount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <Link
              href={`/user/orders/${orderId}`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand to-brand-active hover:from-brand hover:to-brand-active text-on-brand font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
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
      <div className="bg-surface-elevated border border-border rounded-xl p-4 space-y-2 text-xs text-foreground">
        <div className="flex items-center justify-between text-foreground-secondary">
          <span>Order Reference</span>
          <span className="font-mono font-bold text-warning">#{orderNumber || orderId.slice(0, 8)}</span>
        </div>
        <div className="flex items-center justify-between text-foreground-secondary">
          <span>Platform Escrow Fee (15%)</span>
          <span className="font-semibold text-foreground-muted">${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-foreground-secondary">
          <span>Vendor Net Guaranteed (85%)</span>
          <span className="font-semibold text-success">${vendorNet.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t border-border flex items-center justify-between font-bold text-sm">
          <span>Total Payable</span>
          <span className="text-base text-warning">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-surface-elevated border border-border rounded-xl p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-danger-soft text-danger border border-danger/30 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand via-brand to-brand-active hover:from-brand hover:to-brand-active disabled:opacity-50 disabled:cursor-not-allowed text-on-brand font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-gold-glow-sm flex items-center justify-center gap-2 cursor-pointer"
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

      <div className="flex items-center justify-center gap-2 text-[11px] text-foreground-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
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
      colorPrimary: "#DFB76C",
      colorBackground: "#0B0C0E",
      colorText: "#F3F4F6",
      colorDanger: "#EF4444",
      fontFamily: "var(--font-jakarta), var(--font-inter), sans-serif",
      borderRadius: "0px",
    },
    rules: {
      ".Input": {
        backgroundColor: "#121418",
        border: "1px solid #26282E",
        color: "#F3F4F6",
        borderRadius: "0px",
      },
      ".Input:focus": {
        border: "1px solid #DFB76C",
        boxShadow: "0 0 0 1px #DFB76C",
      },
      ".Label": {
        color: "#CBD5E1",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      },
    },
  }), []);

  if (!stripePublicKey) {
    return (
      <div className="p-6 rounded-2xl bg-warning-soft text-warning border border-warning/30 text-warning text-xs">
        Stripe publishable key is not configured in the environment. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center gap-3 text-foreground-muted text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-warning" />
        <span>Initializing secure escrow payment vault...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 rounded-2xl bg-danger-soft text-danger border border-danger/30 text-red-200 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-danger">
          <AlertCircle className="w-4 h-4 text-danger" />
          <span>Payment Error</span>
        </div>
        <p>{loadError}</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-surface/10 hover:bg-surface/20 text-foreground font-semibold text-xs"
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
