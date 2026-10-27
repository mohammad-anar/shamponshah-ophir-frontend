"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetPaymentMethodsQuery,
  useCreateSetupIntentMutation,
  useSavePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} from "@/redux/service/payments/paymentsApi";
import { useGetPaymentLedgerQuery } from "@/redux/service/orders/ordersApi";

export default function UserPaymentsPage() {
  const { data: methodsData, isLoading: methodsLoading } = useGetPaymentMethodsQuery();
  const { data: ledgerData, isLoading: ledgerLoading } = useGetPaymentLedgerQuery();

  const [createSetupIntent, { isLoading: isCreatingSetup }] = useCreateSetupIntentMutation();
  const [savePaymentMethod, { isLoading: isSavingCard }] = useSavePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();
  const [removePaymentMethod] = useRemovePaymentMethodMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [makeDefault, setMakeDefault] = useState(true);
  const [stripeReady, setStripeReady] = useState(false);
  const stripeRef = useRef<ReturnType<NonNullable<typeof window.Stripe>> | null>(null);

  const savedMethods = methodsData?.data || methodsData || [];
  const ledgerOrders = ledgerData?.data?.orders || ledgerData?.orders || [];
  const ledgerItems = ledgerOrders.flatMap((order: any) => (order.transactions || []).map((tx: any) => ({
    ...tx,
    id: tx.txRef || tx.id,
    date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "",
    description: tx.description || `Order ${order.orderNumber}`,
    method: "Stripe payment method",
    total: `$${Number(tx.amount || 0).toFixed(2)}`,
    status: tx.status,
  })));
  const cardElementRef = useRef<{ mount: (el: HTMLElement) => void; unmount: () => void } | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!isAddModalOpen || !stripeReady || !cardContainerRef.current || !window.Stripe || !key || cardElementRef.current) return;
    const stripe = window.Stripe(key);
    const card = stripe.elements().create("card");
    card.mount(cardContainerRef.current);
    stripeRef.current = stripe;
    cardElementRef.current = card;
    return () => { card.unmount(); cardElementRef.current = null; stripeRef.current = null; };
  }, [isAddModalOpen, stripeReady]);

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id).unwrap();
      toast.success("Default payment method updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to set default method");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removePaymentMethod(id).unwrap();
      toast.success("Payment method removed");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to remove method");
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!key || !stripeRef.current || !cardElementRef.current) throw new Error("Secure card entry is unavailable. Refresh and try again.");
      const setup = await createSetupIntent().unwrap();
      const confirmation = await stripeRef.current.confirmCardSetup(setup.clientSecret, {
        payment_method: { card: cardElementRef.current as any },
      });
      if (confirmation.error) throw new Error(confirmation.error.message || "Card verification failed.");
      const paymentMethod = confirmation.setupIntent?.payment_method;
      const paymentMethodId = typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;
      if (!paymentMethodId) throw new Error("Stripe did not return a saved card.");
      await savePaymentMethod({ paymentMethodId, isDefault: makeDefault }).unwrap();
      toast.success("Payment method saved.");
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save card to vault");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
        <h1 className="text-2xl font-bold text-foreground">Payments &amp; Billing History</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Review milestone charges, refunds, and saved payment methods.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated shadow-xs flex items-center gap-1.5 self-start cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-brand-primary" /> Add Payment Method
        </button>
      </div>

      {/* Escrow Custody Banner */}
      <div className="bg-surface-sunken text-foreground p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-info-solid text-foreground/20 border border-info/30/30 flex items-center justify-center text-foreground">
            <Lock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-warning">
              Active Custody Balance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold">${Number(ledgerData?.data?.escrowTotal ?? ledgerData?.escrowTotal ?? 0).toFixed(2)}</span>
            </div>
            <p className="text-xs text-info mt-1">
              Paid milestone funds are held on the marketplace Stripe balance until release or refund.
            </p>
          </div>
        </div>

      </div>

      {/* Saved Payment Methods Section */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            <h2 className="text-sm font-bold text-foreground">Saved Payment Methods</h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-info-soft text-brand-primary">
              Stripe Vault Verified
            </span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Card
          </button>
        </div>

        {methodsLoading ? (
          <div className="py-6 flex items-center justify-center text-foreground-muted gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            <span>Loading payment methods...</span>
          </div>
        ) : savedMethods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {savedMethods.map((pm: any) => (
              <div
                key={pm.id}
                className={cn(
                  "p-4 rounded-xl border relative transition-all flex flex-col justify-between",
                  pm.isDefault
                    ? "border-brand-primary bg-info-soft/30 shadow-2xs"
                    : "border-border hover:border-border bg-surface"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-surface-sunken text-foreground font-bold text-[10px] uppercase tracking-wider">
                      {pm.brand || "Card"}
                    </div>
                    {pm.isDefault && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-success-soft text-success">
                        <Check className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(pm.id)}
                    className="text-foreground-muted hover:text-danger p-1 rounded transition-colors"
                    title="Remove card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="my-3">
                  <p className="font-mono text-sm font-bold text-foreground">
                    •••• •••• •••• {pm.last4 || "4242"}
                  </p>
                  <p className="text-[11px] text-foreground-muted mt-0.5">
                    Expires {pm.expMonth ? `${pm.expMonth}/${pm.expYear}` : "12/2028"}
                  </p>
                </div>

                {!pm.isDefault && (
                  <button
                    onClick={() => handleSetDefault(pm.id)}
                    className="text-[11px] font-semibold text-brand-primary hover:underline text-left pt-2 border-t border-border"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-border rounded-xl space-y-2">
            <CreditCard className="w-6 h-6 text-foreground-secondary mx-auto" />
            <p className="text-xs font-semibold text-foreground-secondary">No payment methods saved yet</p>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              Save a card to enable 1-click escrow deposit and seamless milestone releases.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 px-3 py-1.5 bg-brand-primary text-foreground text-xs font-bold rounded-lg shadow-xs hover:bg-info-soft transition-colors"
            >
              Add Your First Card
            </button>
          </div>
        )}
      </div>

      {/* Transaction History Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-border font-bold text-foreground flex items-center justify-between">
          <span>Payment &amp; Escrow History</span>
          {ledgerLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground-muted" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-elevated border-b border-border text-[11px] font-bold uppercase text-foreground-muted">
              <tr>
                <th className="py-3 px-4">Transaction ID &amp; Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Total Charged</th>
                <th className="py-3 px-4">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ledgerItems.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    #{tx.id}
                    <span className="text-[10px] text-foreground-muted font-normal block">{tx.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">{tx.description}</td>
                  <td className="py-3.5 px-4 text-foreground-secondary">{tx.method}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{tx.total}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                (tx.status === "PENDING" || tx.status === "PROCESSING") &&
                          "bg-warning-soft text-warning border border-warning/30",
                tx.status === "SUCCEEDED" &&
                          "bg-success-soft text-success border border-success/30"
                      )}
                    >
                      {tx.status === "SUCCEEDED" ? "Paid" : tx.status === "FAILED" ? "Failed" : tx.status === "REFUNDED" ? "Refunded" : tx.status || "Processing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-base text-foreground">Add New Payment Card</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-foreground-muted hover:text-foreground-secondary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs">
              <div className="p-3 bg-info-soft/60 border border-info/30 rounded-xl text-[11px] text-info flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-info flex-shrink-0" />
                <span>
                  Card details are securely tokenized with Stripe. Your CVV is never stored on our servers.
                </span>
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Card details</label>
                <div ref={cardContainerRef} className="w-full bg-surface-elevated border border-border rounded-xl p-3" />
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" onLoad={() => setStripeReady(true)} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-0"
                />
                <span className="font-semibold text-foreground-secondary">Set as my default payment method</span>
              </label>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCard || isCreatingSetup}
                  className="w-1/2 py-2.5 bg-brand-primary hover:bg-info-soft text-foreground font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSavingCard || isCreatingSetup ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save Card</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
