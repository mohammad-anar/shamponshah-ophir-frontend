"use client";

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Globe, 
  Instagram, 
  CheckCircle2,
  Loader2,
  X,
  UploadCloud,
  ExternalLink,
  Phone,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetMyVendorProfileQuery, 
  useUpdateVendorProfileMutation,
  useAddPortfolioItemMutation,
  useDeletePortfolioItemMutation
} from "@/redux/service/vendors/vendorsApi";
import { useUploadFileMutation } from "@/redux/service/upload/uploadApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
}

export default function VendorProfileEditorPage() {
  const { data: profileData, isLoading, refetch } = useGetMyVendorProfileQuery();
  const [updateProfileMutation, { isLoading: isUpdating }] = useUpdateVendorProfileMutation();
  const [addPortfolioMutation, { isLoading: isAddingPhoto }] = useAddPortfolioItemMutation();
  const [deletePortfolioMutation] = useDeletePortfolioItemMutation();
  const [uploadFile, { isLoading: isUploadingMedia }] = useUploadFileMutation();
  const { data: categoriesData } = useGetCategoriesQuery();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [travelRadius, setTravelRadius] = useState("40 miles");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Photo Modal State
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [modalPhotoUrl, setModalPhotoUrl] = useState("");
  const [modalPhotoTitle, setModalPhotoTitle] = useState("");
  const [modalSelectedFile, setModalSelectedFile] = useState<File | null>(null);
  const [modalFilePreview, setModalFilePreview] = useState<string | null>(null);
  const [isModalDragging, setIsModalDragging] = useState(false);

  // Load Vendor Profile Data
  useEffect(() => {
    const p = (profileData as any)?.data || profileData;
    if (p) {
      setBusinessName(p.businessName || p.name || "");
      setHeadline(p.tagline || p.title || "");
      setBio(p.bio || "");
      setCity(p.city || (p.location ? p.location.split(",")[0]?.trim() : ""));
      setState(p.state || (p.location ? p.location.split(",")[1]?.trim() : "IL"));
      setTravelRadius(p.serviceRadius || "40 miles");
      setWebsite(p.website || "");
      setInstagram(p.instagram || "");
      setAvatarUrl(p.avatarUrl || p.avatar || "");
      setHeroImageUrl(p.heroImageUrl || p.heroImage || "");
      setSlug(p.slug || "");

      if (p.categories && Array.isArray(p.categories)) {
        setSelectedCategoryIds(p.categories.map((c: any) => c.categoryId || c.category?.id || c.id).filter(Boolean));
      }

      if (p.portfolio && Array.isArray(p.portfolio)) {
        setPortfolio(
          p.portfolio.map((item: any) => ({
            id: item.id,
            title: item.caption || item.title || "Event Showcase",
            image: item.url || item.image || "",
          }))
        );
      } else {
        setPortfolio([]);
      }
    }
  }, [profileData]);

  // Handle Avatar Upload
  const handleAvatarFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData).unwrap();
      if (res?.url) {
        setAvatarUrl(res.url);
        await updateProfileMutation({ avatarUrl: res.url }).unwrap();
        toast.success("Profile photo updated!");
      }
    } catch {
      toast.error("Could not upload avatar image");
    }
  };

  // Handle Banner Upload
  const handleBannerFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setHeroImageUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData).unwrap();
      if (res?.url) {
        setHeroImageUrl(res.url);
        await updateProfileMutation({ heroImageUrl: res.url }).unwrap();
        toast.success("Banner cover updated!");
      }
    } catch {
      toast.error("Could not upload banner image");
    }
  };

  // Handle Profile Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateProfileMutation({
        businessName: businessName.trim(),
        name: businessName.trim(),
        tagline: headline.trim(),
        title: headline.trim(),
        bio: bio.trim(),
        city: city.trim(),
        state: state.trim(),
        location: `${city.trim()}, ${state.trim()}`,
        serviceRadius: travelRadius.trim(),
        website: website.trim(),
        instagram: instagram.trim(),
        avatarUrl,
        heroImageUrl,
        categoryIds: selectedCategoryIds,
      }).unwrap();

      toast.success("Storefront profile saved successfully!");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save profile storefront.");
    }
  };

  // Modal File Drop Handlers
  const handleModalFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    setModalSelectedFile(file);
    setModalFilePreview(URL.createObjectURL(file));
  };

  const onModalDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsModalDragging(true);
  };

  const onModalDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsModalDragging(false);
  };

  const onModalDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsModalDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleModalFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Add Portfolio Photo Submit
  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = modalPhotoUrl.trim();

    if (modalSelectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", modalSelectedFile);
        const uploadRes = await uploadFile(formData).unwrap();
        if (uploadRes?.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch {
        if (modalFilePreview) {
          finalImageUrl = modalFilePreview;
        }
      }
    }

    if (!finalImageUrl) {
      toast.error("Please select a photo or enter an image URL.");
      return;
    }

    try {
      const res = await addPortfolioMutation({
        url: finalImageUrl,
        caption: modalPhotoTitle.trim() || "Milestone Event Showcase",
      }).unwrap();

      const newItem: PortfolioItem = {
        id: res?.id || `p-${Date.now()}`,
        title: modalPhotoTitle.trim() || "Milestone Event Showcase",
        image: finalImageUrl,
      };

      setPortfolio((prev) => [newItem, ...prev]);
      toast.success("Portfolio photo added to storefront!");

      // Reset modal
      setPhotoModalOpen(false);
      setModalPhotoUrl("");
      setModalPhotoTitle("");
      setModalSelectedFile(null);
      setModalFilePreview(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not add portfolio item.");
    }
  };

  // Delete Portfolio Photo
  const handleDeletePhoto = async (id: string) => {
    try {
      await deletePortfolioMutation(id).unwrap();
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
      toast.success("Portfolio image removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not remove portfolio item.");
    }
  };

  const allCategories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray((categoriesData as any)?.data)
    ? (categoriesData as any).data
    : [];

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Hidden File Inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={handleBannerFileChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Storefront Profile
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-soft text-success">
              Live in Directory
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Edit your business information, bio, contact details, and event portfolio shown to buyers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {slug && (
            <Link
              href={`/vendors/profile/${slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
              <span>View Public Page</span>
            </Link>
          )}

          <button
            onClick={() => handleSave()}
            disabled={isUpdating}
            className="px-5 py-2 bg-brand hover:bg-surface-sunken text-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-warning" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-success-soft border border-success/30 rounded-xl text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-success" /> Storefront profile updated successfully!
        </div>
      )}

      {/* Profile Header & Visual Assets */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        {/* Banner Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-brand to-info overflow-hidden group">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt="Banner cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs font-bold">
              Custom Banner Cover
            </div>
          )}

          <div className="absolute inset-0 bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-background/60 hover:bg-background/80 text-foreground text-xs font-bold backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Camera className="w-4 h-4 text-warning" />
              <span>Change Cover Banner</span>
            </button>
          </div>
        </div>

        {/* Profile Details Header */}
        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-brand text-foreground flex items-center justify-center font-black text-2xl border-4 border-border-strong shadow-md overflow-hidden bg-cover bg-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  businessName.slice(0, 2).toUpperCase() || "PP"
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                title="Change Profile Photo"
                className="absolute bottom-0 right-0 p-1.5 bg-surface border border-border rounded-lg shadow-sm text-foreground-secondary hover:text-brand-primary cursor-pointer hover:bg-surface-elevated transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-info-soft text-info border border-info/30 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-info" /> Verified Escrow Vendor
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Business / Brand Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Luminary Event Studios"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Headline / Specialty *</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Luxury Wedding DJ &amp; Sound Production"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground-secondary font-bold mb-1">About Your Craft &amp; Experience *</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, milestones handled, equipment used, and setup experience..."
                className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-brand-primary resize-none leading-relaxed"
              />
            </div>

            {/* Location & Radius */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">City / Region *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Chicago"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="IL"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Service Travel Radius</label>
                <input
                  type="text"
                  value={travelRadius}
                  onChange={(e) => setTravelRadius(e.target.value)}
                  placeholder="e.g. 50 miles"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Links & Socials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Website URL</label>
                <div className="flex items-center rounded-xl border border-border bg-surface-elevated overflow-hidden focus-within:border-brand-primary">
                  <span className="px-3 text-foreground-muted">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full bg-transparent p-2.5 text-foreground font-semibold focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Instagram Handle</label>
                <div className="flex items-center rounded-xl border border-border bg-surface-elevated overflow-hidden focus-within:border-brand-primary">
                  <span className="px-3 text-foreground-muted">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full bg-transparent p-2.5 text-foreground font-semibold focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Grid */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Portfolio &amp; Event Media</h2>
            <p className="text-xs text-foreground-muted">
              High-resolution photos showcasing past setups, performances, and celebrations. These appear on your profile and the home page showcase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalPhotoUrl("");
              setModalPhotoTitle("");
              setModalSelectedFile(null);
              setModalFilePreview(null);
              setPhotoModalOpen(true);
            }}
            className="px-4 py-2 bg-brand hover:bg-surface-sunken text-foreground rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-warning" />
            <span>Upload Photo</span>
          </button>
        </div>

        {portfolio.length === 0 ? (
          <div
            onClick={() => setPhotoModalOpen(true)}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-brand-primary hover:bg-surface-elevated/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-info-soft text-brand-primary flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-foreground">No portfolio photos uploaded yet</p>
            <p className="text-[11px] text-foreground-muted mt-0.5">Click here to upload photos of your past work</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-border h-44 bg-surface-sunken shadow-xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-black/20 to-transparent p-2.5 flex flex-col justify-between opacity-90">
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(item.id)}
                    className="self-end p-1.5 rounded-full bg-background/60 text-foreground hover:bg-danger-solid text-foreground transition-colors cursor-pointer shadow-xs"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <p className="text-[11px] font-bold text-foreground line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photo Modal with File Upload & URL Option */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Add Event Media to Portfolio</h3>
                <p className="text-[11px] text-foreground-muted">Upload high-res event photography from your device or paste a URL</p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="text-foreground-muted hover:text-foreground-secondary p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              {/* File Upload Area */}
              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleModalFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div
                onDragOver={onModalDragOver}
                onDragLeave={onModalDragLeave}
                onDrop={onModalDrop}
                onClick={() => modalFileInputRef.current?.click()}
                className={cn(
                  "p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                  isModalDragging
                    ? "border-brand-primary bg-info-soft/50 scale-[1.01]"
                    : modalFilePreview
                    ? "border-success/30 bg-success-soft/30"
                    : "border-border bg-surface-elevated hover:border-brand-primary"
                )}
              >
                {modalFilePreview ? (
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modalFilePreview}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-lg border border-border mx-auto shadow-xs"
                    />
                    <p className="text-success font-bold text-xs">Photo selected! Click to change</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-brand-primary mb-2" />
                    <p className="font-bold text-foreground text-xs">Drag &amp; drop an event photo, or click to browse</p>
                    <p className="text-[10px] text-foreground-muted mt-0.5">JPG, PNG, WEBP up to 50MB</p>
                  </>
                )}
              </div>

              {/* Alternative: Image URL */}
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Or paste photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or hosted URL"
                  value={modalPhotoUrl}
                  onChange={(e) => {
                    setModalPhotoUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setModalFilePreview(e.target.value.trim());
                    }
                  }}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Caption / Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Ballroom Wedding Stage &amp; Ambient Lighting"
                  value={modalPhotoTitle}
                  onChange={(e) => setModalPhotoTitle(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground text-xs focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingPhoto || isUploadingMedia}
                  className="px-5 py-2 bg-brand hover:bg-surface-sunken text-foreground rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {isAddingPhoto || isUploadingMedia ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-warning" />
                  )}
                  <span>Add to Portfolio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
