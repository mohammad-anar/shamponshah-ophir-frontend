"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Headphones, Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSubmitInquiryMutation } from "@/redux/service/contact/contactApi";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("concierge");
  const [message, setMessage] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [sent, setSent] = useState(false);

  const [submitInquiry, { isLoading: isSubmitting }] = useSubmitInquiryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await submitInquiry({
        name,
        email,
        phone: phone.trim() || undefined,
        topic,
        message,
      }).unwrap();

      const ticket = res?.ticketNumber || `OPH-TKT-${Date.now().toString(36).toUpperCase()}`;
      setTicketNumber(ticket);
      setSent(true);
      toast.success(`Inquiry #${ticket} received! Our concierge will respond within 2 hours.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit concierge request. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-[#F3F4F6] min-h-screen py-10 lg:py-16 font-sans selection:bg-[#DFB76C] selection:text-[#0B0C0E]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-[#1A1D24] text-[#DFB76C] text-xs font-bold uppercase tracking-widest border border-border-brand/40">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 DEDICATED CONCIERGE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-light text-foreground tracking-tight leading-[1.15]">
            How can our hospitality desk help?
          </h1>

          <p className="text-foreground-secondary text-sm sm:text-base font-light leading-relaxed">
            Whether you need custom multi-vendor ceremonial curation, escrow disbursement guidance, or emergency event support, our team is standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-6">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground-secondary">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Maya Patel"
                      className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground-secondary">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground-secondary">Assistance Category</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none cursor-pointer"
                    >
                      <option value="concierge">VIP Celebration Concierge & Artisan Matching</option>
                      <option value="escrow">Escrow Vault Payouts & Deposit Inquiries</option>
                      <option value="vendor">Artisan Guild Application & Badging</option>
                      <option value="dispute">Mediation Council & Terms Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground-secondary">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (312) 555-0194"
                      className="w-full h-11 px-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground-secondary">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your celebration date, guest count, or specific assistance needed..."
                    className="w-full p-3.5 bg-[#0B0C0E] text-foreground border border-[#26282E] rounded-none focus:border-[#DFB76C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 h-12 bg-[#DFB76C] hover:bg-[#ECC870] active:scale-99 text-[#0B0C0E] font-bold text-xs uppercase tracking-wider rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0B0C0E]" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#0B0C0E]" />
                      <span>Send Concierge Request</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-none bg-[#0D211A] text-success border border-success/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  {ticketNumber && (
                    <span className="text-[11px] font-mono font-bold text-[#DFB76C] bg-[#1A1D24] px-3 py-1 rounded-none border border-border-brand/40">
                      TICKET #{ticketNumber}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-light text-foreground pt-1">Inquiry Registered</h3>
                </div>
                <p className="text-xs text-foreground-muted max-w-sm mx-auto font-light">
                  Our live hospitality desk has registered your ticket. A senior coordinator will follow up via email at <strong className="text-foreground">{email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="text-xs font-bold text-[#DFB76C] hover:underline"
                >
                  Submit another inquiry &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121418] rounded-none p-6 sm:p-8 shadow-2xl border border-[#26282E] space-y-5">
              <h3 className="font-serif font-light text-lg text-foreground">Direct Channels</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Hospitality & Concierge Desk</div>
                    <a href="mailto:concierge@ophirreserve.com" className="text-foreground-muted hover:text-[#DFB76C] transition-colors">
                      concierge@ophirreserve.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] text-success flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Live Escrow Support Line</div>
                    <a href="tel:+18005556744" className="text-foreground-muted hover:text-[#DFB76C] transition-colors">
                      +1 (800) 555-OPHIR (Mon–Sun, 8am–10pm EST)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-none bg-[#1A1D24] border border-[#26282E] text-[#DFB76C] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Corporate Headquarters</div>
                    <div className="text-foreground-muted">
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
