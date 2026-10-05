"use client";

import { useState } from "react";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ShieldCheck, 
  Sparkles, 
  Reply, 
  Send, 
  CheckCircle2, 
  Award,
  Filter
} from "lucide-react";

interface VendorReview {
  id: string;
  clientName: string;
  clientAvatar: string;
  eventTitle: string;
  eventDate: string;
  rating: number;
  comment: string;
  response?: string;
  tags: string[];
}

const mockVendorReviews: VendorReview[] = [
  {
    id: "r1",
    clientName: "Emily Carter",
    clientAvatar: "EC",
    eventTitle: "Emily & David's Golden Ophir Wedding",
    eventDate: "Sep 28, 2025",
    rating: 5,
    comment: "Marcus was incredible! He kept the dance floor packed all evening. The sound setup was crystal clear and he accommodated every single song request from our family hub.",
    response: "Thank you so much Emily! It was an absolute honor playing for your celebration. Wishing you both a lifetime of happiness!",
    tags: ["Punctual", "High Energy", "Great Sound Quality"],
  },
  {
    id: "r2",
    clientName: "David Miller",
    clientAvatar: "DM",
    eventTitle: "Miller 40th Birthday Celebration",
    eventDate: "Aug 14, 2025",
    rating: 5,
    comment: "Flawless transitions between 90s hip-hop and current dance chart toppers. He read the room perfectly. Will definitely book again for our corporate anniversary!",
    response: "Much appreciated David! Loved the crowd vibe and song selections.",
    tags: ["Crowd Reader", "Professional", "Top Equipment"],
  },
  {
    id: "r3",
    clientName: "Jessica Wong",
    clientAvatar: "JW",
    eventTitle: "Lakefront Charity Gala 2025",
    eventDate: "Jul 22, 2025",
    rating: 4.8,
    comment: "Super professional audio technician. The wireless microphones worked without a single glitch across the 200-person tent. Great dinner background music.",
    tags: ["Crystal Audio", "Flawless Mics"],
  }
];

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<VendorReview[]>(mockVendorReviews);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    setReviews(reviews.map((r) => 
      r.id === reviewId ? { ...r, response: replyText } : r
    ));
    setReplyingToId(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Verified Client Reviews</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              4.95 / 5.0 Rating
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build buyer trust by responding to client testimonials and highlighting your 5-star milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Award className="w-4 h-4 text-amber-600" /> Top Rated Reputation
          </div>
        </div>
      </div>

      {/* Rating Breakdown Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
          <span className="text-4xl font-black text-[#0F0C3B]">4.95</span>
          <div className="flex items-center text-amber-400 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on 38 verified client reviews</p>
        </div>

        <div className="md:col-span-2 space-y-2 justify-center flex flex-col text-xs">
          {[
            { stars: "5 Star", pct: 95, count: 36 },
            { stars: "4 Star", pct: 5, count: 2 },
            { stars: "3 Star", pct: 0, count: 0 },
            { stars: "2 Star", pct: 0, count: 0 },
            { stars: "1 Star", pct: 0, count: 0 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-12 text-slate-600 font-semibold">{row.stars}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${row.pct}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <span className="w-8 text-right text-slate-400 font-mono">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-[#0F0C3B]">Client Testimonials ({reviews.length})</h2>

        <div className="divide-y divide-slate-100 space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="pt-6 first:pt-0 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {r.clientAvatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F0C3B]">{r.clientName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{r.eventTitle} &bull; {r.eventDate}</p>
                  </div>
                </div>

                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= r.rating ? "fill-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-indigo-50 text-brand-primary text-[10px] font-bold">
                    ✓ {t}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-[#F8F9FD] p-3.5 rounded-xl border border-slate-100">
                "{r.comment}"
              </p>

              {/* Public Reply if exists */}
              {r.response ? (
                <div className="ml-6 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-primary">
                    <Reply className="w-3.5 h-3.5" /> Your Public Response
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{r.response}"
                  </p>
                </div>
              ) : (
                <div>
                  {replyingToId === r.id ? (
                    <div className="ml-6 space-y-2 mt-2">
                      <textarea
                        rows={3}
                        placeholder="Write your professional thank-you response to the client..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(r.id)}
                          className="px-4 py-1.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" /> Post Public Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingToId(r.id)}
                      className="ml-6 text-xs text-brand-primary hover:text-indigo-900 font-bold flex items-center gap-1"
                    >
                      <Reply className="w-3.5 h-3.5" /> Reply to client review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
