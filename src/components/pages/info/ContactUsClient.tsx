"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Headphones, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("concierge");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Inquiry received! Our concierge will respond within 2 hours.");
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 DEDICATED EVENT CONCIERGE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
            How can our hospitality desk help?
          </h1>

          <p className="text-slate-600 text-sm sm:text-base">
            Whether you need custom multi-vendor RFP curation, escrow disbursement guidance, or emergency event support, our team is standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-6">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Maya Patel"
                      className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Assistance Category</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="concierge">VIP Celebration Concierge & Vendor Matching</option>
                    <option value="escrow">Escrow Vault Payouts & Deposit Inquiries</option>
                    <option value="vendor">Artisan Guild Application & Badging</option>
                    <option value="dispute">Mediation Council & Terms Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your celebration date, guest count, or specific assistance needed..."
                    className="w-full p-3.5 bg-[#F9F8F5] text-obsidian border border-[#E2DDD3] rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-12 bg-[#0F1228] hover:bg-[#1A1F40] active:scale-99 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Concierge Request</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-obsidian">Message Delivered</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Our live hospitality team has received your ticket. A senior coordinator will follow up via email within 2 hours.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#EAE6DF] space-y-5">
              <h3 className="font-serif font-bold text-lg text-obsidian">Direct Channels</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-obsidian">Hospitality & Concierge Desk</div>
                    <a href="mailto:concierge@ophirreserve.com" className="text-slate-500 hover:text-obsidian hover:underline">
                      concierge@ophirreserve.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-obsidian">Live Escrow Support Line</div>
                    <a href="tel:+18005556744" className="text-slate-500 hover:text-obsidian hover:underline">
                      +1 (800) 555-OPHIR (Mon–Sun, 8am–10pm EST)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-obsidian">Corporate Headquarters</div>
                    <div className="text-slate-500">
                      Ophir Reserve Technologies, 500 W 2nd St, Suite 1900, Austin, TX 78701
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
