"use client";

import { useState } from "react";
import { 
  Camera, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  Upload, 
  Award, 
  Globe, 
  Instagram, 
  CheckCircle2
} from "lucide-react";

export default function VendorProfileEditorPage() {
  const [businessName, setBusinessName] = useState("Party Pulse Events & DJ");
  const [headline, setHeadline] = useState("Premier Wedding & Gala DJ | High-Energy Multi-Genre Sound");
  const [bio, setBio] = useState("With over 10 years of experience rocking celebrations across the Midwest, Party Pulse delivers an unforgettable musical journey. From romantic acoustic cocktail hour to packed dance floors with custom laser lighting and wireless audio systems.");
  const [city, setCity] = useState("Chicago, IL");
  const [travelRadius, setTravelRadius] = useState("60 miles");
  const [yearsExperience, setYearsExperience] = useState(10);
  const [website, setWebsite] = useState("https://partypulseevents.com");
  const [instagram, setInstagram] = useState("@partypulse_chicago");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Portfolio items
  const [portfolio, setPortfolio] = useState([
    { id: "p1", title: "Lakefront Ballroom Reception", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80" },
    { id: "p2", title: "Downtown Corporate Summit Fanfare", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80" },
    { id: "p3", title: "Gold Arches & Dance Floor Uplighting", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80" }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Public Storefront Profile</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              Live in Search
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This information is showcased to buyers when they browse vendors, view gigs, and invite you to bid on events.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Storefront
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Storefront profile updated successfully!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Banner Cover Image */}
        <div className="relative h-44 bg-gradient-to-r from-[#0F0C3B] to-indigo-900 flex items-center justify-center">
          <button className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 transition-colors">
            <Camera className="w-3.5 h-3.5" /> Change Banner Image
          </button>
        </div>

        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-[#0F0C3B] text-white flex items-center justify-center font-black text-2xl border-4 border-white shadow-md">
                PP
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-lg shadow-xs text-slate-600 hover:text-brand-primary">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Rising Vendor Tier (4.95 ⭐)
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified ID & Insurance
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Business / Stage Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Base Location</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Catchy Profile Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">About Your Craft & Experience</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-brand-primary resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Travel Radius</label>
                <input
                  type="text"
                  value={travelRadius}
                  onChange={(e) => setTravelRadius(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F0C3B]">Portfolio & Event Media</h2>
            <p className="text-xs text-slate-500">High-resolution photos showcasing past setups and performances</p>
          </div>
          <button 
            onClick={() => alert("Upload new portfolio image modal")}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-200 h-40">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between opacity-90">
                <button 
                  onClick={() => setPortfolio(portfolio.filter((p) => p.id !== item.id))}
                  className="self-end p-1.5 rounded-full bg-black/50 text-white hover:bg-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
