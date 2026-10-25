"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetMyVendorProfileQuery, 
  useUpdateVendorProfileMutation,
  useAddPortfolioItemMutation,
  useDeletePortfolioItemMutation
} from "@/redux/service/vendors/vendorsApi";

export default function VendorProfileEditorPage() {
  const { data: profileData, isLoading } = useGetMyVendorProfileQuery();
  const [updateProfileMutation, { isLoading: isUpdating }] = useUpdateVendorProfileMutation();
  const [addPortfolioMutation, { isLoading: isAddingPhoto }] = useAddPortfolioItemMutation();
  const [deletePortfolioMutation] = useDeletePortfolioItemMutation();

  const [businessName, setBusinessName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [travelRadius, setTravelRadius] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [portfolio, setPortfolio] = useState<{id: string; title: string; image: string}[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Photo Modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");

  useEffect(() => {
    const p = (profileData as any)?.data || profileData;
    if (p) {
      if (p.name || p.businessName) setBusinessName(p.name || p.businessName);
      if (p.title || p.tagline) setHeadline(p.title || p.tagline);
      if (p.bio) setBio(p.bio);
      if (p.location || p.city) setCity(p.location || (p.city ? `${p.city}${p.state ? `, ${p.state}` : ''}` : ''));
      if (p.serviceRadius) setTravelRadius(p.serviceRadius);
      if (p.website) setWebsite(p.website);
      if (p.instagram) setInstagram(p.instagram);
      if (p.portfolio && Array.isArray(p.portfolio)) {
        setPortfolio(p.portfolio.map((item: any) => ({
          id: item.id,
          title: item.caption || item.title || "Celebration Portfolio Item",
          image: item.url,
        })));
      } else setPortfolio([]);
    }
  }, [profileData]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateProfileMutation({
        name: businessName,
        businessName,
        title: headline,
        tagline: headline,
        bio,
        location: city,
        city: city.split(",")[0]?.trim() || city,
        serviceRadius: travelRadius,
        website,
        instagram,
      }).unwrap();
      toast.success("Profile storefront updated successfully!");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save profile.");
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    try {
      const res = await addPortfolioMutation({
        url: newPhotoUrl.trim(),
        caption: newPhotoTitle.trim() || "Event Showcase",
      }).unwrap();

      const newItem = {
        id: res?.id || `p-${Date.now()}`,
        title: newPhotoTitle.trim() || "Event Showcase",
        image: newPhotoUrl.trim(),
      };
      setPortfolio(prev => [newItem, ...prev]);
      toast.success("Portfolio item added!");
      setPhotoModalOpen(false);
      setNewPhotoUrl("");
      setNewPhotoTitle("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not add portfolio item.");
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deletePortfolioMutation(id).unwrap();
      setPortfolio(prev => prev.filter(p => p.id !== id));
      toast.success("Portfolio image removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not remove portfolio item.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
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
            Showcase your craft to clients when they browse vendors, view gigs, and invite you to bid on events.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isUpdating}
          className="px-5 py-2.5 bg-[#0F0C3B] hover:bg-[#18124E] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-300" />}
          <span>Save Storefront</span>
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
          <button className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer">
            <Camera className="w-3.5 h-3.5 text-amber-300" /> Change Banner Image
          </button>
        </div>

        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-[#0F0C3B] text-white flex items-center justify-center font-black text-2xl border-4 border-white shadow-md">
                {businessName.slice(0, 2).toUpperCase() || "PP"}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-lg shadow-xs text-slate-600 hover:text-brand-primary cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Top Performing Guild (4.95 ⭐)
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified ID &amp; Insurance
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Business / Stage Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Base Location *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Catchy Profile Headline *</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">About Your Craft &amp; Experience *</label>
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
                  placeholder="https://yourbrand.com"
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourhandle"
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
            <h2 className="text-sm font-bold text-[#0F0C3B]">Portfolio &amp; Event Media</h2>
            <p className="text-xs text-slate-500">High-resolution photos showcasing past setups and performances</p>
          </div>
          <button 
            onClick={() => setPhotoModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-brand-primary" /> Add Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between opacity-90">
                <button 
                  onClick={() => handleDeletePhoto(item.id)}
                  className="self-end p-1.5 rounded-full bg-black/50 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Photo Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0F0C3B]">Add Portfolio Image</h3>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or hosted URL"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Caption / Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Reception Grand Ballroom"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingPhoto}
                  className="px-5 py-2 bg-[#0F0C3B] hover:bg-[#18124E] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isAddingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5 text-amber-300" />}
                  <span>Save Image</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
