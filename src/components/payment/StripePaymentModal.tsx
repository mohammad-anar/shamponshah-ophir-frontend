"use client";

import React from "react";
import { X, Shield, Lock } from "lucide-react";
import CustomStripePaymentForm from "./CustomStripePaymentForm";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  amount?: number;
  onSuccess?: (confirmedData: any) => void;
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  onSuccess,
}: StripePaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0c0a1a] border border-amber-500/20 rounded-2xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Escrow Payment Vault</h3>
              <p className="text-xs text-slate-400">Separate Charges &amp; Transfers on Stripe Connect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10">
          <CustomStripePaymentForm
            orderId={orderId}
            orderNumber={orderNumber}
            amount={amount}
            onSuccess={(data) => {
              if (onSuccess) onSuccess(data);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
