"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronRight,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import FamilyPaymentModal from "@/components/user/FamilyPaymentModal";

export interface HubServiceDetail {
  id: string;
  vendorId?: string;
  gigId?: string;
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
  status: "Booked (Escrow Active)" | "Pending Booking" | "Funded (Escrow Active)" | "Partially Funded" | "Awaiting Contributions";
  eventId?: string;
  eventName?: string;
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
  events?: Array<{ id: string; title: string; occasion?: string }>;
  onVote: (serviceId: string) => void;
  onPaymentSuccess: (serviceId: string, amount: number, contributorName: string) => void;
  onAssignEvent?: (serviceId: string, eventId: string, eventTitle: string) => void;
  onRemoveService?: (serviceId: string) => void;
}

export default function FamilyServiceDetailModal({
  isOpen,
  onClose,
  service,
  events = [],
  onVote,
  onPaymentSuccess,
  onAssignEvent,
  onRemoveService,
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
        <div className="bg-surface rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in flex flex-col max-h-[90vh]">
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
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-foreground text-[11px] font-bold border border-border-strong">
                {service.category}
              </span>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-surface border-2 border-white overflow-hidden flex items-center justify-center text-[#0F0C3B] font-bold text-xs shadow-md">
                    {service.vendorAvatar.startsWith("http") ? (
                      <img src={service.vendorAvatar} alt={service.vendorName} className="w-full h-full object-cover" />
                    ) : (
                      service.vendorAvatar
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      {service.vendorName}
                      <ShieldCheck className="w-4 h-4 text-success" />
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-foreground-secondary">
                      <span className="flex items-center text-warning font-bold">
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
                <span className="text-[10px] text-foreground-secondary uppercase font-bold block">Contract Total</span>
                <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                  ${service.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
            {/* Celebration Event Assignment Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-surface border border-indigo-200 flex items-center justify-center text-brand-primary shadow-xs">
                  <Calendar className="w-4 h-4 text-info" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-foreground-muted block tracking-wider">
                    Assigned Celebration Event
                  </span>
                  <span className="font-bold text-[#0F0C3B] text-xs">
                    {service.eventName || "Unassigned / General Suggestion"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={service.eventId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const ev = events.find((item) => item.id === selectedId);
                    onAssignEvent?.(service.id, selectedId, ev?.title || "Unassigned Suggestion");
                  }}
                  className="bg-surface border border-border rounded-xl px-3 py-1.5 font-bold text-xs text-[#0F0C3B] shadow-2xs hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Unassigned / Idea Bank</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} {ev.occasion ? `(${ev.occasion})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Added By & Member Note Callout */}
            <div className="p-4 rounded-2xl bg-[#EDE9FE]/60 border border-indigo-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F0C3B] text-foreground flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 shadow-xs">
                {service.addedBy.avatar}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F0C3B]">
                    Added by {service.addedBy.name} <span className="text-foreground-muted font-normal">({service.addedBy.role})</span>
                  </span>
                  <span className="text-[10px] text-foreground-muted">{service.addedBy.date}</span>
                </div>
                <p className="text-foreground-secondary italic leading-relaxed">
                  "{service.note}"
                </p>
              </div>
            </div>

            {/* Full Booking & Escrow Status Banner */}
            <div className="p-5 rounded-2xl bg-[#F8F9FD] border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                    Service Booking Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {isFullyFunded ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        <span>Booked (100% Escrow Funded)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs flex items-center gap-1.5 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Full Payment & Booking</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/user/messages?vendorName=${encodeURIComponent(service.vendorName)}&category=${encodeURIComponent(service.category)}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-indigo-200 text-brand-primary hover:bg-indigo-50 font-bold transition-colors shadow-2xs text-xs"
                    title="Direct Message this Vendor"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-info" />
                    <span>Message Vendor</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => onVote(service.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-foreground-secondary hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold transition-colors shadow-2xs text-xs"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{service.votesUp} Likes</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-foreground-muted uppercase font-semibold block">Total Package Contract</span>
                  <span className="font-bold text-[#0F0C3B] font-mono text-sm">${service.totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-foreground-muted uppercase font-semibold block">Booking Requirement</span>
                  <span className="text-emerald-700 font-bold text-xs">Single 100% Full Escrow Payment</span>
                </div>
              </div>
            </div>

            {/* Service Package Inclusions Checklist */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-primary" /> Service Inclusions & Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground-secondary">
                {service.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-elevated border border-border">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="leading-snug">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Comments / Discussion Feed */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#0F0C3B] text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-primary" /> Family Feedback & Discussion
                </h4>
                <span className="text-foreground-muted text-[11px]">{comments.length} comments</span>
              </div>

              {/* Feed items */}
              <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar">
                {comments.map((cm) => (
                  <div key={cm.id} className="p-3 bg-surface-elevated rounded-xl border border-border space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0F0C3B]">{cm.author}</span>
                      <span className="text-foreground-muted">{cm.time}</span>
                    </div>
                    <p className="text-foreground-secondary leading-relaxed">{cm.text}</p>
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
                  className="flex-1 bg-[#F8F9FD] border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-foreground rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="p-4 sm:p-5 border-t border-border bg-surface-elevated flex items-center justify-between gap-3 flex-shrink-0">
            <div className="text-xs">
              <span className="text-foreground-muted block text-[10px] uppercase font-bold">Stripe Escrow Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected & Insured
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/user/messages?vendorId=${service.vendorId || ""}&vendorName=${encodeURIComponent(service.vendorName)}&category=${encodeURIComponent(service.category)}`}
                className="px-3.5 py-2 text-xs font-semibold text-brand-primary hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all flex items-center gap-1.5"
                title="Message Service Provider"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Vendor</span>
              </Link>

              {onRemoveService && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove "${service.title}" from this Family Hub?`)) {
                      onRemoveService(service.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1.5 border border-rose-100 mr-1"
                  title="Remove this service from hub"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-foreground-secondary hover:text-foreground"
              >
                Close
              </button>

              {isFullyFunded ? (
                <div className="px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Booked (100% Escrow Active)</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-6 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-foreground rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-warning" />
                  <span>Book Service & Pay in Full (${service.totalPrice.toLocaleString()})</span>
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
