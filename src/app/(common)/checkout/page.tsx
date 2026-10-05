"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  CreditCard,
  Building,
  Check,
  Sparkles,
} from "lucide-react";
import { VENDORS } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CheckoutBookingPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId") || "golden-hour-photo";
  const vendor = VENDORS.find((v) => v.id === vendorId) || VENDORS[0];

  const [selectedAddons, setSelectedAddons] = useState<string[]>(["addon-drone"]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ach" | "apple">("card");
  const [eventDate, setEventDate] = useState("2025-10-18");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addonsList = [
    {
      id: "addon-drone",
      title: "Licensed 4K Aerial Drone Coverage",
      desc: "Full FAA Part 107 licensed cinematic flyovers of venue and grand entrance.",
      price: 300,
    },
    {
      id: "addon-second",
      title: "Dedicated Second Master Shooter",
      desc: "Simultaneous groom prep and guest arrival coverage in low light.",
      price: 450,
    },
    {
      id: "addon-film",
      title: "Handcrafted 35mm Analog Film Roll & Prints",
      desc: "Vintage film scans delivered with 50 heirloom physical prints.",
      price: 250,
    },
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const basePackagePrice = vendor.packages[0]?.price || 1450;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const found = addonsList.find((a) => a.id === id);
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotal = basePackagePrice + addonsTotal;
  const platformFee = subtotal * 0.05; // 5%
  const grandTotal = subtotal + platformFee;

  const milestone1 = subtotal * 0.3; // 30%
  const milestone2 = subtotal * 0.5; // 50%
  const milestone3 = subtotal * 0.2; // 20%

  const handleConfirmEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Deposit locked into Escrow Vault successfully!");
    }, 1500);
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UTSOB ESCROW VAULT CHECKOUT</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight mt-1">
              Secure Milestone Gig Booking
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ✓ Step 1: Package
            </span>
            <span>→</span>
            <span className="text-obsidian bg-white px-2.5 py-1 rounded-md border border-slate-300">
              Step 2: Vault Lock
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
                      {vendor.packages[0]?.title || "Golden Hour Wedding Storytelling"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Artisan: <span className="font-semibold text-obsidian">{vendor.name}</span> • {vendor.location}
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

              {/* Add-on Upgrades */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border border-[#EAE6DF] space-y-4">
                <h3 className="font-serif font-bold text-lg text-obsidian">
                  Custom Add-on Options
                </h3>
                <div className="space-y-3">
                  {addonsList.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4",
                          isSelected
                            ? "bg-[#FAF9F5] border-[#0F1228]"
                            : "bg-white border-[#EAE6DF] hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors",
                              isSelected ? "bg-[#0F1228] text-white" : "border border-slate-300 bg-white"
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs sm:text-sm text-obsidian">
                              {addon.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{addon.desc}</p>
                          </div>
                        </div>

                        <span className="font-serif font-bold text-sm text-obsidian whitespace-nowrap">
                          +${addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestone Schedule */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border border-[#EAE6DF] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-obsidian">
                    Milestone Disbursement Schedule
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Client Sign-Off Required
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Milestone 1 */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0F1228] text-white text-[10px] font-bold flex items-center justify-center">
                          1
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-obsidian">
                          30% Booking Retainer
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-7">
                        Locks date on artisan calendar. Held safely in vault.
                      </p>
                    </div>
                    <span className="font-serif font-bold text-sm text-obsidian">
                      ${milestone1.toFixed(2)}
                    </span>
                  </div>

                  {/* Milestone 2 */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0F1228] text-white text-[10px] font-bold flex items-center justify-center">
                          2
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-obsidian">
                          50% Day-of Arrival & Execution
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-7">
                        Released when vendor arrives on site on event day.
                      </p>
                    </div>
                    <span className="font-serif font-bold text-sm text-obsidian">
                      ${milestone2.toFixed(2)}
                    </span>
                  </div>

                  {/* Milestone 3 */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0F1228] text-white text-[10px] font-bold flex items-center justify-center">
                          3
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-obsidian">
                          20% Final Deliverables Sign-Off
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-7">
                        Released strictly after you review and approve high-res edits.
                      </p>
                    </div>
                    <span className="font-serif font-bold text-sm text-obsidian">
                      ${milestone3.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Order Summary & Payment Method */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury-lg border border-[#EAE6DF] space-y-6">
                <h3 className="font-serif font-bold text-xl text-obsidian">
                  Escrow Deposit Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-b border-[#EAE6DF] pb-4">
                  <div className="flex justify-between">
                    <span>Base Package Fee</span>
                    <span className="font-bold text-obsidian">${basePackagePrice.toLocaleString()}</span>
                  </div>

                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Selected Add-ons ({selectedAddons.length})</span>
                      <span className="font-bold text-obsidian">+${addonsTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Platform Concierge & Escrow Fee (5%)
                    </span>
                    <span className="font-bold text-obsidian">+${platformFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>FDIC Deposit Insurance Protection</span>
                    <span>$0.00 (Included)</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      TOTAL ESCROW DEPOSIT
                    </span>
                    <span className="font-serif text-3xl font-extrabold text-obsidian">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    Protected in Vault
                  </span>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Vault Deposit Method
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all",
                        paymentMethod === "card"
                          ? "bg-[#FAF9F5] border-[#0F1228] text-obsidian shadow-2xs"
                          : "bg-white border-[#EAE6DF] text-slate-600"
                      )}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ach")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all",
                        paymentMethod === "ach"
                          ? "bg-[#FAF9F5] border-[#0F1228] text-obsidian shadow-2xs"
                          : "bg-white border-[#EAE6DF] text-slate-600"
                      )}
                    >
                      <Building className="w-4 h-4" />
                      <span>Bank ACH</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("apple")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all",
                        paymentMethod === "apple"
                          ? "bg-[#FAF9F5] border-[#0F1228] text-obsidian shadow-2xs"
                          : "bg-white border-[#EAE6DF] text-slate-600"
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apple Pay</span>
                    </button>
                  </div>
                </div>

                {/* Submit Escrow Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#0F1228] hover:bg-[#1A1F40] active:scale-99 text-white font-bold text-sm rounded-xl shadow-lg shadow-gold-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gold-400" />
                      <span>Lock ${grandTotal.toFixed(2)} into Escrow Vault</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Your funds are segregated in Utsob FDIC-insured escrow. Funds are never released to the vendor without your explicit milestone authorization.
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
                ESCROW VAULT CONFIRMED • BOOKING #OPH-8921
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian">
                Your celebration is officially secured!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                <span className="font-bold text-obsidian">${grandTotal.toFixed(2)}</span> has been deposited into the Utsob Trust Vault. {vendor.name} has been notified and your date is guaranteed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Artisan:</span>
                <span className="font-bold text-obsidian">{vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Date:</span>
                <span className="font-bold text-obsidian">{eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone 1 Retainer:</span>
                <span className="font-bold text-emerald-600">${milestone1.toFixed(2)} Locked</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/vendors"
                className="w-full sm:w-auto px-6 py-3 bg-[#0F1228] text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Browse More Vendors
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
      </div>
    </div>
  );
}
