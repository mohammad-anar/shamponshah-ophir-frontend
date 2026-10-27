"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  DollarSign,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateGigMutation } from "@/redux/service/gigs/gigsApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";
import { useUploadFileMutation } from "@/redux/service/upload/uploadApi";

interface GalleryImage {
  id: string;
  url: string;
  name?: string;
  isUploading?: boolean;
}

export default function CreateGigPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API mutations & queries
  const [createGig, { isLoading: isCreatingGig }] = useCreateGigMutation();
  const [uploadFile] = useUploadFileMutation();
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data
    : [];

  // Wizard State (Simplified to 4 essential steps)
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [gigTitle, setGigTitle] = useState(
    "DJ and host your birthday party with music, lights and games"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  // Sync selected category when categories load
  if (categories.length > 0 && !selectedCategoryId) {
    setSelectedCategoryId(categories[0].id);
    setSelectedCategoryName(categories[0].name);
  }

  const [tags, setTags] = useState<string[]>([
    "Birthday DJ",
    "Interactive Emcee",
    "Party Lighting",
  ]);
  const [tagInput, setTagInput] = useState("");

  // Step 2: Pricing
  const [basicPrice, setBasicPrice] = useState("450");
  const [standardPrice, setStandardPrice] = useState("850");
  const [premiumPrice, setPremiumPrice] = useState("1400");

  // Step 3: Description
  const [description, setDescription] = useState(
    "High-energy DJ and interactive MC experience curated specifically for kids and family birthday celebrations. Full sound rig, child-safe volume limits, cordless microphones, bubble effects, and lively group activities."
  );

  // Step 4: Gallery & Media
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: "sample-1",
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      name: "party-dj-cover.jpg",
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Tag Management
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim();
      if (!tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  // Image Upload & Drop Handlers
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingFiles(true);
    const newItems: GalleryImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/") && !file.type.includes("video")) {
        toast.error(`${file.name} is not an image or video.`);
        continue;
      }

      // Instant local preview
      const localId = `local-${Date.now()}-${i}`;
      const objectUrl = URL.createObjectURL(file);
      const tempItem: GalleryImage = {
        id: localId,
        url: objectUrl,
        name: file.name,
        isUploading: true,
      };
      newItems.push(tempItem);

      // Upload in background to backend
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadFile(formData).unwrap();
        if (res?.url) {
          tempItem.url = res.url;
          tempItem.isUploading = false;
        }
      } catch {
        // Fallback to data URL so the image stays persistent
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            tempItem.url = event.target.result as string;
            tempItem.isUploading = false;
            setGalleryImages((prev) => [...prev]);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    setGalleryImages((prev) => [...prev, ...newItems]);
    setIsUploadingFiles(false);
    toast.success("Images added to gallery!");
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // reset input value so re-uploading same file works
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setGalleryImages((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        url: urlInput.trim(),
        name: "Direct Image Link",
      },
    ]);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("Image URL added to gallery");
  };

  // Step Validation & Navigation
  const handleNext = async () => {
    if (step === 1) {
      if (!gigTitle.trim()) {
        toast.error("Please enter a title for your service.");
        return;
      }
      if (!selectedCategoryId) {
        toast.error("Please select an active service category. Categories are administered by platform admin.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const bPrice = parseFloat(basicPrice.replace(/[^0-9.]/g, ""));
      const sPrice = parseFloat(standardPrice.replace(/[^0-9.]/g, ""));
      const pPrice = parseFloat(premiumPrice.replace(/[^0-9.]/g, ""));

      if (![bPrice, sPrice, pPrice].every((p) => Number.isFinite(p) && p > 0)) {
        toast.error("Please enter valid prices for your packages.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!description.trim()) {
        toast.error("Please provide a service description.");
        return;
      }
      setStep(4);
      return;
    }

    // Step 4: Publish Gig
    await handlePublish();
  };

  const handlePublish = async () => {
    try {
      const bPrice = parseFloat(basicPrice.replace(/[^0-9.]/g, "")) || 450;
      const sPrice = parseFloat(standardPrice.replace(/[^0-9.]/g, "")) || 850;
      const pPrice = parseFloat(premiumPrice.replace(/[^0-9.]/g, "")) || 1400;

      const imageUrls = galleryImages.map((img) => img.url).filter(Boolean);

      if (!selectedCategoryId) {
        toast.error("A valid service category is required to publish this gig.");
        return;
      }

      const payload: any = {
        title: gigTitle.trim(),
        description: description.trim(),
        categoryId: selectedCategoryId,
        category: selectedCategoryName,
        tags,
        images: imageUrls,
        gallery: imageUrls,
        packages: [
          {
            name: "Basic Package",
            description: "Standard setup and 2 hours service coverage",
            price: bPrice,
            turnaroundDays: 3,
          },
          {
            name: "Standard Package",
            description: "Full audio rig, lighting, and 4 hours coverage",
            price: sPrice,
            turnaroundDays: 3,
            isPopular: true,
          },
          {
            name: "Premium VIP Package",
            description: "Complete concert audio, moving lights, and 6 hours coverage",
            price: pPrice,
            turnaroundDays: 3,
          },
        ],
      };

      if (selectedCategoryId) {
        payload.categoryId = selectedCategoryId;
      }

      await createGig(payload).unwrap();

      toast.success("Gig Submitted for Review!", {
        description: "Your listing status is Pending Verification. It will go live once reviewed and approved by Admin.",
      });
      router.push("/vendor/gigs");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (Array.isArray(err?.data?.message) ? err.data.message.join(", ") : null) ||
        "Could not publish your service.";
      toast.error(msg);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const coverImageUrl =
    galleryImages.length > 0 ? galleryImages[0].url : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Publish a New Service Listing</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            Set up your service details, package pricing, and photos.
          </p>
        </div>

        <Link
          href="/vendor/gigs"
          className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated"
        >
          Exit Draft
        </Link>
      </div>

      {/* 4-Step Stepper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
        {[
          { num: 1, label: "Overview" },
          { num: 2, label: "Pricing" },
          { num: 3, label: "Description" },
          { num: 4, label: "Gallery & Publish" },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (s.num < step) setStep(s.num);
            }}
            className="flex items-center gap-2 flex-1 min-w-[120px] cursor-pointer"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                step === s.num
                  ? "bg-brand text-foreground shadow-xs"
                  : step > s.num
                  ? "bg-success-solid text-foreground text-foreground"
                  : "bg-surface-sunken text-foreground-secondary"
              )}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={cn(
                "text-xs font-semibold whitespace-nowrap",
                step === s.num ? "text-foreground font-bold" : "text-foreground-muted"
              )}
            >
              {s.label}
            </span>
            {s.num < 4 && <div className="h-[2px] bg-surface-sunken flex-1 ml-1" />}
          </div>
        ))}
      </div>

      {/* 2-Column Split: Form (7 cols) + Live Card Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-6 text-xs">
          {/* STEP 1: Overview */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 1 of 4 • Basic Information
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1">Gig Title &amp; Category</h2>
                <p className="text-foreground-muted mt-0.5">
                  Give your service listing a clear, memorable title and pick a primary category.
                </p>
              </div>

              {/* Gig Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="font-bold text-foreground">Gig Title *</label>
                  <span className="text-foreground-muted text-[11px]">{gigTitle.length} / 80</span>
                </div>
                <div className="flex items-center rounded-xl border border-border bg-surface-elevated overflow-hidden focus-within:border-brand-primary focus-within:bg-surface">
                  <span className="px-3.5 py-2.5 bg-surface-sunken border-r border-border font-bold text-foreground-secondary select-none">
                    I will
                  </span>
                  <input
                    type="text"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    placeholder="DJ and host your birthday party with music, lights and games"
                    className="w-full bg-transparent px-3 py-2.5 text-xs text-foreground font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Category */}
              <div>
                <label className="block font-bold text-foreground mb-1">Service Category *</label>
                {isLoadingCategories ? (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" /> Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-3 bg-warning-soft border border-warning/30 rounded-xl text-warning text-xs">
                    No service categories configured yet. An administrator must create categories before gigs can be published.
                  </div>
                ) : (
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const found = categories.find((c: any) => c.id === val || c.name === val);
                      if (found) {
                        setSelectedCategoryId(found.id);
                        setSelectedCategoryName(found.name);
                      }
                    }}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-foreground font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
                    required
                  >
                    <option value="" disabled>-- Select a Category --</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Search Tags */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-bold text-foreground">Search Tags (up to 5)</label>
                  <span className="text-foreground-muted">{tags.length} of 5 used</span>
                </div>
                <div className="p-2 rounded-xl border border-border bg-surface-elevated flex flex-wrap gap-1.5 items-center">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-foreground flex items-center gap-1 shadow-xs"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-foreground-muted hover:text-danger font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type tag &amp; press Enter..."
                      className="bg-transparent text-xs text-foreground placeholder:text-foreground-muted focus:outline-none px-2 py-1 flex-1 min-w-[130px]"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 2 of 4 • Package Pricing
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1">Set Your Tier Rates</h2>
                <p className="text-foreground-muted mt-0.5">
                  Clients can choose between Basic, Standard, or Premium service packages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-2">
                  <span className="text-xs font-bold text-foreground-secondary block">Basic Package</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">
                      $
                    </span>
                    <input
                      type="text"
                      value={basicPrice}
                      onChange={(e) => setBasicPrice(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-foreground"
                    />
                  </div>
                  <p className="text-[10px] text-foreground-muted">Standard 2 hours essential coverage</p>
                </div>

                <div className="p-4 rounded-xl border border-info/30 bg-info-soft/40 space-y-2 ring-2 ring-indigo-50">
                  <span className="text-xs font-bold text-foreground block">
                    Standard (Most Popular)
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">
                      $
                    </span>
                    <input
                      type="text"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-foreground"
                    />
                  </div>
                  <p className="text-[10px] text-foreground-muted">4 hours, audio setup &amp; emcee</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-2">
                  <span className="text-xs font-bold text-foreground-secondary block">Premium VIP</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">
                      $
                    </span>
                    <input
                      type="text"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-foreground"
                    />
                  </div>
                  <p className="text-[10px] text-foreground-muted">6 hours, full lights &amp; top equipment</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Description */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 3 of 4 • Service Description
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1">Describe What You Offer</h2>
                <p className="text-foreground-muted mt-0.5">
                  Explain your experience, equipment, and what clients receive.
                </p>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">
                  Service Description *
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail your service capabilities, equipment, and workflow..."
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-xs text-foreground focus:outline-none focus:border-brand-primary leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Gallery & Publish */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Step 4 of 4 • Gallery &amp; Launch
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1">Showcase Your Work</h2>
                <p className="text-foreground-muted mt-0.5">
                  Upload photos or videos of past events. Drag &amp; drop files or click to browse.
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4"
                onChange={onFileInputChange}
                className="hidden"
              />

              {/* Drag & Drop Area */}
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                  isDragging
                    ? "border-brand-primary bg-info-soft/50 scale-[1.01]"
                    : "border-border bg-surface-elevated hover:border-brand-primary hover:bg-surface-sunken/60"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-surface border border-border shadow-xs flex items-center justify-center mb-3">
                  {isUploadingFiles ? (
                    <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-brand-primary" />
                  )}
                </div>

                <p className="font-bold text-foreground text-sm">
                  {isDragging ? "Drop your images here" : "Drag & drop photos or click to browse"}
                </p>
                <p className="text-[11px] text-foreground-muted mt-1">
                  Supported formats: JPG, PNG, WEBP up to 50MB
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-brand text-foreground text-[11px] font-bold shadow-xs hover:bg-surface-sunken cursor-pointer"
                  >
                    Select Photos from Computer
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUrlInput(!showUrlInput);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground-secondary text-[11px] font-bold hover:bg-surface-elevated"
                  >
                    Paste URL
                  </button>
                </div>
              </div>

              {/* Direct URL input bar */}
              {showUrlInput && (
                <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste image link (https://...)"
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 rounded-lg bg-brand text-foreground text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Uploaded Gallery Grid */}
              {galleryImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground-secondary">
                      Uploaded Photos ({galleryImages.length})
                    </span>
                    <span className="text-[10px] text-foreground-muted">First image is your card cover</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="group relative rounded-xl border border-border overflow-hidden bg-surface-sunken aspect-video shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.name || `Gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-brand text-foreground text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                            Cover Photo
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-red-700"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground-secondary hover:bg-surface-elevated disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isCreatingGig}
              className="px-6 py-2.5 rounded-xl bg-brand hover:bg-surface-sunken text-foreground text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isCreatingGig ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Gig...</span>
                </>
              ) : step === 4 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-warning" />
                  <span>Publish Gig to Marketplace</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground-muted">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Live Card Preview
            </span>
            <span className="text-[10px] text-foreground-muted">Buyer Viewpoint</span>
          </div>

          {/* Card Preview */}
          <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden text-xs">
            {coverImageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden bg-surface-sunken">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Gig cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent flex items-end p-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-background/60 backdrop-blur-xs text-foreground text-[10px] font-bold uppercase">
                    {selectedCategoryName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-surface-sunken p-4 text-foreground flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-surface/10 text-[10px] font-bold uppercase">
                  {selectedCategoryName}
                </span>
                <span className="text-[10px] font-extrabold bg-warning-solid text-on-brand text-foreground px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>
            )}

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand text-foreground flex items-center justify-center font-bold text-xs">
                  PP
                </div>
                <div>
                  <span className="font-bold text-foreground block">Party Pulse Events</span>
                  <span className="text-[10px] text-warning font-semibold">
                    ★ Top Verified Vendor
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                  I will {gigTitle || "perform and deliver this service for your event"}
                </h3>
                <p className="text-[11px] text-foreground-muted mt-1">{selectedCategoryName}</p>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 bg-surface-sunken text-foreground-secondary rounded-md font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-foreground-muted block">
                    STARTING AT
                  </span>
                  <span className="text-xl font-extrabold text-foreground">
                    ${basicPrice || "450"}
                  </span>
                </div>
                <span className="text-xs font-bold text-brand-primary">View Packages →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
