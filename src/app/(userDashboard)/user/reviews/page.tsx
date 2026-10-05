"use client";

import { useState } from "react";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  ThumbsUp, 
  ShieldCheck, 
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";

interface PendingReview {
  id: string;
  orderId: string;
  vendorName: string;
  serviceTitle: string;
  category: string;
  avatar: string;
  completedDate: string;
  amount: number;
}

interface SubmittedReview {
  id: string;
  orderId: string;
  vendorName: string;
  serviceTitle: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  responseFromVendor?: string;
}

const mockPending: PendingReview[] = [
  {
    id: "p1",
    orderId: "ORD-8820",
    vendorName: "Sparkle Decor & Rentals",
    serviceTitle: "Gold Chiavari Chairs & Luxury Linens (150 Sets)",
    category: "Decor & Rentals",
    avatar: "SD",
    completedDate: "Oct 02, 2025",
    amount: 1450,
  }
];

const mockSubmitted: SubmittedReview[] = [
  {
    id: "r1",
    orderId: "ORD-8818",
    vendorName: "Windy City Sound DJ",
    serviceTitle: "Cocktail Jazz & Evening Reception DJ Master Set",
    avatar: "WC",
    rating: 5,
    date: "Sep 28, 2025",
    comment: "Marcus was incredible! He kept the dance floor packed all evening. The sound setup was crystal clear and he accommodated every single song request from our family hub.",
    responseFromVendor: "Thank you so much Emily! It was an absolute honor playing for your celebration. Wishing you both a lifetime of happiness!",
  },
  {
    id: "r2",
    orderId: "ORD-8790",
    vendorName: "Gourmet Bites & Bar Co.",
    serviceTitle: "Artisan Grazing Table & Signature Cocktail Bar",
    avatar: "GB",
    rating: 5,
    date: "Sep 15, 2025",
    comment: "The signature smoked rosemary old fashioneds were the highlight of the night. Guests are still talking about the cured meats and artisan cheese board!",
    responseFromVendor: "We loved crafting the menu for you! Thanks for trusting Gourmet Bites.",
  }
];

export default function UserReviewsPage() {
  const [pending, setPending] = useState<PendingReview[]>(mockPending);
  const [submitted, setSubmitted] = useState<SubmittedReview[]>(mockSubmitted);
  const [selectedPending, setSelectedPending] = useState<PendingReview | null>(null);
  
  // Review Modal state
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPending || !reviewComment.trim()) return;

    const newRev: SubmittedReview = {
      id: `r-${Date.now()}`,
      orderId: selectedPending.orderId,
      vendorName: selectedPending.vendorName,
      serviceTitle: selectedPending.serviceTitle,
      avatar: selectedPending.avatar,
      rating: rating,
      date: "Just now",
      comment: reviewComment,
    };

    setSubmitted([newRev, ...submitted]);
    setPending(pending.filter((p) => p.id !== selectedPending.id));
    setSelectedPending(null);
    setReviewComment("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Reviews & Testimonials</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Verified Feedback
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rate completed event services and help the Ophir community discover trustworthy artisans.
          </p>
        </div>
      </div>

      {/* Pending Reviews Queue */}
      {pending.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-bold text-[#0F0C3B]">Pending Reviews ({pending.length})</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">Earn 100 Ophir Reward Points</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((p) => (
              <div 
                key={p.id}
                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs">
                    {p.avatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F0C3B]">{p.vendorName}</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{p.serviceTitle}</p>
                    <p className="text-[10px] text-slate-400">Completed on {p.completedDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPending(p)}
                  className="px-3.5 py-1.5 bg-brand-primary hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex-shrink-0"
                >
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Reviews List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#0F0C3B]">Your Past Reviews ({submitted.length})</h2>

        <div className="divide-y divide-slate-100 space-y-4">
          {submitted.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F0C3B] text-white flex items-center justify-center font-bold text-xs">
                    {rev.avatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F0C3B]">{rev.vendorName}</h3>
                    <p className="text-[11px] text-slate-500">{rev.serviceTitle}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? "fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pl-13">
                "{rev.comment}"
              </p>

              {/* Vendor Public Reply if any */}
              {rev.responseFromVendor && (
                <div className="ml-13 p-3 bg-[#F8F9FD] border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-primary">
                    <MessageSquare className="w-3.5 h-3.5" /> Response from {rev.vendorName}
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{rev.responseFromVendor}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {selectedPending && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0F0C3B]">Rate & Review Vendor</h2>
                <p className="text-xs text-slate-500">{selectedPending.vendorName} &bull; {selectedPending.serviceTitle}</p>
              </div>
              <button onClick={() => setSelectedPending(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Select */}
              <div className="text-center py-2 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Overall Experience Rating</span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star ? "fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-brand-primary">
                  {rating === 5 ? "Exceptional 5.0" : rating === 4 ? "Very Good 4.0" : rating === 3 ? "Average 3.0" : "Needs Improvement"}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Detailed Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about punctuality, quality of performance, professionalism, communication..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPending(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
