"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Users2, 
  Send, 
  Heart,
  DollarSign,
  Lock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import FamilyPaymentModal from "@/components/user/FamilyPaymentModal";

export interface HubServiceDetail {
  id: string;
  title: string;
  category: string;
  image: string;
  vendorName: string;
  vendorAvatar: string;
  vendorRating: number;
  vendorReviewCount: number;
  vendorTier: string;
  location: string;
  totalPrice: number;
  amountPaid: number;
  status: "Funded (Escrow Active)" | "Partially Funded" | "Awaiting Contributions";
  addedBy: {
    name: string;
    avatar: string;
    role: string;
    date: string;
  };
  note: string;
  votesUp: number;
  votedBy: string[];
  inclusions: string[];
  contributors: { name: string; amount: number; avatar: string; date: string }[];
  comments: { id: string; author: string; avatar: string; text: string; time: string }[];
}

interface FamilyServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: HubServiceDetail;
  onVote: (serviceId: string) => void;
  onPaymentSuccess: (serviceId: string, amount: number, contributorName: string) => void;
}

export default function FamilyServiceDetailModal({
  isOpen,
  onClose,
  service,
  onVote,
  onPaymentSuccess,
}: FamilyServiceDetailModalProps) {
  const [comments, setComments] = useState(service.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen) return null;

  const pct = Math.min(100, Math.round((service.amountPaid / service.totalPrice) * 100));
  const remainingDue = Math.max(0, service.totalPrice - service.amountPaid);
  const isFullyFunded = service.amountPaid >= service.totalPrice;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentItem = {
      id: `c-${Date.now()}`,
      author: "Emily Carter (Host)",
      avatar: "EC",
      text: newComment,
      time: "Just now",
    };

    setComments([...comments, commentItem]);
    setNewComment("");
    toast.success("Comment posted to family discussion!");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in flex flex-col max-h-[90vh]">
          {/* Top Banner Image with Vendor Floating Card */}
          <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900 flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Top Close & Category */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                {service.category}
              </span>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center text-[#0F0C3B] font-bold text-xs shadow-md">
                    {service.vendorAvatar.startsWith("http") ? (
                      <img src={service.vendorAvatar} alt={service.vendorName} className="w-full h-full object-cover" />
                    ) : (
                      service.vendorAvatar
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {service.vendorName}
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-200">
                      <span className="flex items-center text-amber-300 font-bold">
                        <Star className="w-3 h-3 fill-amber-300 mr-0.5" />
                        {service.vendorRating} ({service.vendorReviewCount})
                      </span>
                      <span>&bull;</span>
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-300 uppercase font-bold block">Contract Total</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  ${service.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
            {/* Added By & Member Note Callout */}
            <div className="p-4 rounded-2xl bg-[#EDE9FE]/60 border border-indigo-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 shadow-xs">
                {service.addedBy.avatar}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F0C3B]">
                    Added by {service.addedBy.name} <span className="text-slate-500 font-normal">({service.addedBy.role})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{service.addedBy.date}</span>
                </div>
                <p className="text-slate-700 italic leading-relaxed">
                  "{service.note}"
                </p>
              </div>
            </div>

            {/* Crowdfunding & Payment Status Progress */}
            <div className="p-5 rounded-2xl bg-[#F8F9FD] border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Crowdfunded Stripe Escrow
                  </span>
                  <h4 className="text-sm font-black text-[#0F0C3B] mt-0.5">
                    ${service.amountPaid.toLocaleString()} / ${service.totalPrice.toLocaleString()} Funded
                  </h4>
                </div>

                <button
                  onClick={() => onVote(service.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold transition-colors shadow-2xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{service.votesUp} Family Likes</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-700 ${
                      isFullyFunded ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className={isFullyFunded ? "text-emerald-700" : "text-amber-700"}>
                    {pct}% Funded ({isFullyFunded ? "Complete" : "In Progress"})
                  </span>
                  <span className="text-slate-500">
                    ${remainingDue.toLocaleString()} Remaining Due
                  </span>
                </div>
              </div>

              {/* Contributors Avatars */}
              {service.contributors.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Family Contributions ({service.contributors.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {service.contributors.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-[#0F0C3B] shadow-2xs"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center text-[8px]">
                          {c.avatar}
                        </span>
                        <span>{c.name}:</span>
                        <span className="text-emerald-600 font-mono">${c.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Package Inclusions Checklist */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-primary" /> Service Inclusions & Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                {service.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="leading-snug">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Comments / Discussion Feed */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-primary" /> Family Feedback & Discussion
                </h4>
                <span className="text-slate-400 text-[11px]">{comments.length} comments</span>
              </div>

              {/* Feed items */}
              <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar">
                {comments.map((cm) => (
                  <div key={cm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0F0C3B]">{cm.author}</span>
                      <span className="text-slate-400">{cm.time}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{cm.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Leave a note or question for the family..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#F8F9FD] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Stripe Escrow Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected & Insured
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              {isFullyFunded ? (
                <div className="px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Escrow Funded</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-6 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Contribute Payment / Co-Pay ($)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <FamilyPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          service={{
            id: service.id,
            title: service.title,
            vendorName: service.vendorName,
            totalPrice: service.totalPrice,
            amountPaid: service.amountPaid,
          }}
          onPaymentSuccess={(id, amt, name) => {
            onPaymentSuccess(id, amt, name);
            setIsPaymentModalOpen(false);
          }}
        />
      )}
    </>
  );
}
