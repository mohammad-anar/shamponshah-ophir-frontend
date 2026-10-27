"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  DollarSign, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Plus, 
  Trash2, 
  Layers, 
  CreditCard,
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSubmitOfferMutation } from "@/redux/service/jobs/jobsApi";

interface SendOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
  clientBudget?: string;
  clientName?: string;
  onOfferSent?: (offer: any) => void;
}

interface MilestoneDraft {
  label: string;
  amount: string;
  note?: string;
}

export default function SendOfferModal({
  isOpen,
  onClose,
  jobId,
  jobTitle = "DJ and Emcee for 5th birthday party",
  clientBudget = "$600 – $1,200",
  clientName,
  onOfferSent,
}: SendOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState("850.00");
  const [paymentType, setPaymentType] = useState<"MILESTONE" | "FULL">("MILESTONE");

  // Milestones draft for staged payments
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([
    {
      label: "Deposit & Date Reservation (50%)",
      amount: "425.00",
      note: "Held in escrow custody until event date preparation starts",
    },
    {
      label: "Final Event Execution & Delivery (50%)",
      amount: "425.00",
      note: "Released upon successful on-site event execution & wrap-up",
    },
  ]);

  const [coverLetter, setCoverLetter] = useState(
    "Hi! I would love to perform for your celebration. My setup includes high-definition audio, wireless microphones, warm uplighting, and seamless playlist curation!"
  );
  const [submitOffer, { isLoading: isSubmitting }] = useSubmitOfferMutation();

  // Keep milestones updated when total offerPrice changes if in 50/50 ratio
  const handlePriceChange = (newPrice: string) => {
    setOfferPrice(newPrice);
    const num = Number(newPrice);
    if (!isNaN(num) && num > 0 && milestones.length === 2) {
      const half = (num / 2).toFixed(2);
      const secondHalf = (num - Number(half)).toFixed(2);
      setMilestones([
        { ...milestones[0], amount: half },
        { ...milestones[1], amount: secondHalf },
      ]);
    }
  };

  const handleApplySplit5050 = () => {
    const num = Number(offerPrice) || 0;
    const half = (num / 2).toFixed(2);
    const secondHalf = (num - Number(half)).toFixed(2);
    setMilestones([
      {
        label: "Deposit & Date Reservation (50%)",
        amount: half,
        note: "Held in escrow custody until event date",
      },
      {
        label: "Final Event Execution & Delivery (50%)",
        amount: secondHalf,
        note: "Released upon event completion & client sign-off",
      },
    ]);
  };

  const handleApplySplitThreeWay = () => {
    const num = Number(offerPrice) || 0;
    const p1 = (num * 0.3).toFixed(2);
    const p2 = (num * 0.4).toFixed(2);
    const p3 = (num - Number(p1) - Number(p2)).toFixed(2);
    setMilestones([
      {
        label: "Initial Date Reservation & Retainer (30%)",
        amount: p1,
        note: "Locks vendor calendar for your event",
      },
      {
        label: "Event Day Setup & On-Site Execution (40%)",
        amount: p2,
        note: "Released on event date during execution",
      },
      {
        label: "Final Delivery & Media Sign-Off (30%)",
        amount: p3,
        note: "Released upon final deliverables handover",
      },
    ]);
  };

  const handleAddMilestone = () => {
    if (milestones.length >= 4) {
      toast.info("Maximum 4 milestones allowed per proposal");
      return;
    }
    setMilestones([
      ...milestones,
      {
        label: `Milestone ${milestones.length + 1}`,
        amount: "0.00",
        note: "Staged escrow release",
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 2) {
      toast.info("A milestone offer must have at least 2 stages");
      return;
    }
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneFieldChange = (index: number, field: keyof MilestoneDraft, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  // Calculate sum of milestones
  const milestoneSum = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const totalNum = Number(offerPrice) || 0;
  const isSumMatched = Math.abs(milestoneSum - totalNum) < 0.05;

  if (!isOpen) return null;

  const handleSend = async () => {
    if (isNaN(totalNum) || totalNum <= 0) {
      toast.error("Please enter a valid proposal price");
      return;
    }

    if (paymentType === "MILESTONE" && !isSumMatched) {
      toast.error(`Milestone total ($${milestoneSum.toFixed(2)}) must equal proposed price ($${totalNum.toFixed(2)})`);
      return;
    }

    const escrowSplitJson =
      paymentType === "FULL"
        ? {
            type: "FULL",
            milestones: [
              {
                label: "Full Project Payment (100%)",
                amount: totalNum,
                percentage: 100,
                sortOrder: 1,
                note: "Client pays 100% held in Ophir Escrow. Released upon event completion & final delivery.",
              },
            ],
          }
        : {
            type: "MILESTONE",
            milestones: milestones.map((m, idx) => ({
              label: m.label || `Milestone ${idx + 1}`,
              amount: Number(m.amount) || 0,
              percentage: totalNum > 0 ? Math.round(((Number(m.amount) || 0) / totalNum) * 100) : 50,
              sortOrder: idx + 1,
              note: m.note || "Held in escrow until approved.",
            })),
          };

    if (jobId) {
      try {
        await submitOffer({
          jobId,
          data: {
            price: totalNum,
            message: coverLetter,
            coverLetter,
            deliverables: "Full celebration service package with verified sound and equipment",
            escrowSplitJson,
          },
        }).unwrap();
        toast.success(`Custom offer of $${offerPrice} sent to client!`, {
          description: paymentType === "FULL" ? "Full payment upon completion selected." : `${milestones.length} staged milestones configured.`,
        });
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to submit proposal");
        return;
      }
    } else {
      toast.success(`Custom offer of $${offerPrice} sent!`);
    }

    if (onOfferSent) {
      onOfferSent({
        title: jobTitle,
        price: totalNum,
        note: coverLetter,
        paymentType,
        escrowSplitJson,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121418] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#26282E] animate-in fade-in my-8 text-foreground">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#26282E] flex items-center justify-between bg-[#121418]">
          <div>
            <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              Send Custom Proposal {clientName ? `to ${clientName}` : ""}
            </span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{jobTitle}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#16181F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Client Target Budget */}
          <div className="p-3.5 rounded-xl bg-[#16181F] border border-[#26282E] flex items-center justify-between">
            <span className="text-foreground-muted font-semibold">Client Target Budget:</span>
            <span className="font-extrabold text-[#DFB76C] text-sm">{clientBudget}</span>
          </div>

          {/* Proposed Price */}
          <div>
            <label className="block font-bold text-foreground mb-1">Your Total Proposed Price ($) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">$</span>
              <input
                type="text"
                value={offerPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full bg-[#16181F] border border-[#26282E] rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-[#DFB76C] transition-colors"
                placeholder="0.00"
              />
            </div>
            <span className="text-[10px] text-foreground-muted mt-1 block">
              You receive: <strong className="text-success font-bold">${offerPrice}</strong> (0% vendor fee deduction under Ophir vendor guarantee).
            </span>
          </div>

          {/* Payment Type Selection (Milestone vs Full) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground block">Payment Structure for Client *</label>
              <span className="text-[10px] text-foreground-muted font-medium">Choose how client pays</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentType("MILESTONE")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer relative",
                  paymentType === "MILESTONE"
                    ? "bg-[#1A1D24] border-[#DFB76C] ring-1 ring-[#DFB76C]"
                    : "bg-[#16181F] border-[#26282E] hover:border-slate-600"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Layers className={cn("w-4 h-4", paymentType === "MILESTONE" ? "text-[#DFB76C]" : "text-foreground-muted")} />
                  <span className={cn("font-bold text-xs", paymentType === "MILESTONE" ? "text-foreground" : "text-foreground-secondary")}>
                    Staged Milestones
                  </span>
                </div>
                <p className="text-[10px] text-foreground-muted leading-tight">
                  Divide payment into milestones (e.g. deposit + completion)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("FULL")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer relative",
                  paymentType === "FULL"
                    ? "bg-[#1A1D24] border-[#DFB76C] ring-1 ring-[#DFB76C]"
                    : "bg-[#16181F] border-[#26282E] hover:border-slate-600"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className={cn("w-4 h-4", paymentType === "FULL" ? "text-[#DFB76C]" : "text-foreground-muted")} />
                  <span className={cn("font-bold text-xs", paymentType === "FULL" ? "text-foreground" : "text-foreground-secondary")}>
                    Full Payment on Completion
                  </span>
                </div>
                <p className="text-[10px] text-foreground-muted leading-tight">
                  100% paid once order is delivered &amp; completed
                </p>
              </button>
            </div>
          </div>

          {/* Conditional Payment UI */}
          {paymentType === "MILESTONE" ? (
            <div className="p-4 rounded-xl bg-[#16181F] border border-[#26282E] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-foreground block">Configure Milestones</span>
                  <span className="text-[10px] text-foreground-muted">Specify amount for each stage</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleApplySplit5050}
                    className="px-2 py-1 rounded-lg bg-[#121418] border border-[#26282E] text-[10px] font-semibold text-foreground-secondary hover:text-foreground hover:border-[#DFB76C] cursor-pointer"
                  >
                    50% / 50%
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySplitThreeWay}
                    className="px-2 py-1 rounded-lg bg-[#121418] border border-[#26282E] text-[10px] font-semibold text-foreground-secondary hover:text-foreground hover:border-[#DFB76C] cursor-pointer"
                  >
                    3-Way Split
                  </button>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-2.5">
                {milestones.map((ms, idx) => (
                  <div key={idx} className="p-3 bg-[#121418] rounded-xl border border-[#26282E] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="w-5 h-5 rounded-full bg-[#1A1D24] text-[#DFB76C] border border-border-brand/40 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={ms.label}
                          onChange={(e) => handleMilestoneFieldChange(idx, "label", e.target.value)}
                          className="w-full font-bold text-xs text-foreground bg-transparent border-b border-transparent focus:border-[#DFB76C] focus:outline-none"
                          placeholder={`Milestone ${idx + 1} title`}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-foreground-muted text-[11px]">$</span>
                          <input
                            type="text"
                            value={ms.amount}
                            onChange={(e) => handleMilestoneFieldChange(idx, "amount", e.target.value)}
                            className="w-full bg-[#16181F] border border-[#26282E] rounded-lg pl-5 pr-2 py-1 text-xs font-bold text-right text-foreground focus:outline-none focus:border-[#DFB76C]"
                            placeholder="0.00"
                          />
                        </div>

                        {milestones.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(idx)}
                            className="p-1 text-foreground-muted hover:text-danger hover:bg-danger-soft text-danger rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={ms.note || ""}
                      onChange={(e) => handleMilestoneFieldChange(idx, "note", e.target.value)}
                      className="w-full text-[10px] text-foreground-secondary bg-[#16181F] px-2.5 py-1.5 rounded-md border border-[#26282E] focus:outline-none focus:border-[#DFB76C]"
                      placeholder="Release condition note (e.g. Upon arrival, upon completion)"
                    />
                  </div>
                ))}
              </div>

              {/* Add Milestone & Balance Check */}
              <div className="flex items-center justify-between pt-1">
                {milestones.length < 4 ? (
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-[11px] font-bold text-[#DFB76C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground-muted">
                    Total: <strong className={cn(isSumMatched ? "text-success font-bold" : "text-warning font-bold")}>
                      ${milestoneSum.toFixed(2)}
                    </strong> / ${totalNum.toFixed(2)}
                  </span>
                  {isSumMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <span className="text-[10px] text-danger font-semibold flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" />
                      Difference: ${(totalNum - milestoneSum).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-success-soft text-success border border-emerald-800/40 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-300">Full Payment Escrow Protection</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed mt-0.5">
                    Client deposits <strong>${offerPrice}</strong> into Ophir Vault Escrow upon accepting this proposal. The full 100% amount will be released to you when the order is marked completed and delivered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Proposal Note */}
          <div>
            <label className="block font-bold text-foreground mb-1">Proposal Note &amp; Equipment Inclusions *</label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-[#16181F] border border-[#26282E] rounded-xl p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-[#DFB76C]"
            />
          </div>

          {/* Credits info */}
          <div className="p-3 rounded-xl bg-[#16181F] border border-[#26282E] flex items-center justify-between text-[11px] text-foreground-secondary">
            <span>Bid Credits Cost: <strong className="text-foreground">2 Credits</strong></span>
            <span className="font-semibold text-[#DFB76C]">Remaining Balance: 14 Credits</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#26282E] bg-[#121418] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSubmitting || (paymentType === "MILESTONE" && !isSumMatched)}
            className="px-6 py-2.5 rounded-xl bg-[#DFB76C] hover:bg-[#ECC870] disabled:opacity-50 text-[#0B0C0E] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B0C0E]" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Proposal (2 Credits)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B0C0E]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
