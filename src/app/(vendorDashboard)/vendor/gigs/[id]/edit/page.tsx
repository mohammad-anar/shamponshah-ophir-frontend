"use client";

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Save,
  UploadCloud,
  Trash2,
  Loader2,
  Check,
  Tag,
  DollarSign,
  Layers,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetGigBySlugQuery, useUpdateGigMutation } from "@/redux/service/gigs/gigsApi";
import { useGetCategoriesQuery } from "@/redux/service/categories/categoriesApi";
import { useUploadFileMutation } from "@/redux/service/upload/uploadApi";

interface GalleryImage {
  id: string;
  url: string;
  name?: string;
  isUploading?: boolean;
}

const DEFAULT_CATEGORIES = [
  { id: "dj-live-music", name: "DJ & Live Music" },
  { id: "photography-film", name: "Photography & Film" },
  { id: "floral-balloon-decor", name: "Floral & Balloon Decor" },
  { id: "catering-bakery", name: "Catering & Bakery" },
  { id: "event-planning", name: "Event Planning & Decor" },
  { id: "lighting-sound", name: "Lighting & Sound Rig" },
];

export default function EditGigPage() {
  const params = useParams();
  const router = useRouter();
  const gigId = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Queries & Mutations
  const { data: gigResponse, isLoading: isLoadingGig, isError } = useGetGigBySlugQuery(gigId, {
    skip: !gigId,
  });
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const [updateGig, { isLoading: isUpdating }] = useUpdateGigMutation();
  const [uploadFile] = useUploadFileMutation();

  const categories =
    Array.isArray(categoriesResponse) && categoriesResponse.length > 0
      ? categoriesResponse
      : Array.isArray(categoriesResponse?.data) && categoriesResponse.data.length > 0
      ? categoriesResponse.data
      : DEFAULT_CATEGORIES;

  // Form State
  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("DJ & Live Music");
  const [status, setStatus] = useState<"ACTIVE" | "PAUSED" | "DRAFT">("ACTIVE");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");

  // Package Tier Prices
  const [basicPrice, setBasicPrice] = useState("450");
  const [standardPrice, setStandardPrice] = useState("850");
  const [premiumPrice, setPremiumPrice] = useState("1400");

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Prepopulate form when gig data loads
  useEffect(() => {
    const gig = (gigResponse as any)?.data || gigResponse;
    if (gig) {
      setTitle(gig.title || "");
      setDescription(gig.description || "");
      if (gig.status) setStatus(gig.status);

      // Category
      if (gig.categoryId) setSelectedCategoryId(gig.categoryId);
      if (typeof gig.category === "object" && gig.category?.name) {
        setSelectedCategoryName(gig.category.name);
        if (gig.category.id) setSelectedCategoryId(gig.category.id);
      } else if (typeof gig.category === "string") {
        setSelectedCategoryName(gig.category);
      }

      // Tags
      if (Array.isArray(gig.tags)) {
        setTags(gig.tags);
      }

      // Packages
      if (Array.isArray(gig.packages) && gig.packages.length > 0) {
        if (gig.packages[0]?.price) setBasicPrice(String(gig.packages[0].price));
        if (gig.packages[1]?.price) setStandardPrice(String(gig.packages[1].price));
        if (gig.packages[2]?.price) setPremiumPrice(String(gig.packages[2].price));
      }

      // Gallery
      if (Array.isArray(gig.gallery) && gig.gallery.length > 0) {
        setGalleryImages(
          gig.gallery.map((img: any, idx: number) => ({
            id: img.id || `existing-${idx}`,
            url: img.url,
            name: `Photo ${idx + 1}`,
          }))
        );
      }
    }
  }, [gigResponse]);

  // Tags
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

  // Files
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

      const localId = `local-${Date.now()}-${i}`;
      const objectUrl = URL.createObjectURL(file);
      const tempItem: GalleryImage = {
        id: localId,
        url: objectUrl,
        name: file.name,
        isUploading: true,
      };
      newItems.push(tempItem);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadFile(formData).unwrap();
        if (res?.url) {
          tempItem.url = res.url;
          tempItem.isUploading = false;
        }
      } catch {
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
    toast.success("Photos added to gallery!");
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
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

  // Submit Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a service title.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a service description.");
      return;
    }

    const bPrice = parseFloat(basicPrice.replace(/[^0-9.]/g, "")) || 450;
    const sPrice = parseFloat(standardPrice.replace(/[^0-9.]/g, "")) || 850;
    const pPrice = parseFloat(premiumPrice.replace(/[^0-9.]/g, "")) || 1400;

    const imageUrls = galleryImages.map((img) => img.url).filter(Boolean);

    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      status,
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

    const actualId = (gigResponse as any)?.data?.id || (gigResponse as any)?.id || gigId;

    try {
      await updateGig({ id: actualId, data: payload }).unwrap();
      toast.success("Service listing updated successfully!");
      router.push(`/vendor/gigs/${actualId}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not update service listing.");
    }
  };

  if (isLoadingGig) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-foreground-muted gap-3 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="font-semibold text-foreground-secondary">Loading service for editing...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-surface border border-border rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#0F0C3B]">Unable to Load Service</h2>
        <Link
          href="/vendor/gigs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F0C3B] text-foreground text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Gigs
        </Link>
      </div>
    );
  }

  const coverImageUrl = galleryImages.length > 0 ? galleryImages[0].url : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/vendor/gigs/${gigId}`}
            className="p-2 rounded-xl border border-border hover:bg-surface-elevated text-foreground-secondary transition-colors cursor-pointer"
            title="Cancel &amp; return"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0F0C3B]">Edit Service Listing</h1>
            <p className="text-foreground-muted mt-0.5">
              Update pricing, packages, description, and photos for this listing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/vendor/gigs/${gigId}`}
            className="px-4 py-2 rounded-xl border border-border text-foreground-secondary font-bold hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-5 py-2 bg-[#0F0C3B] hover:bg-[#18124E] text-foreground rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
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

      {/* 2-Column Split: Form (7 cols) + Live Card Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Basic Info */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider">
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label className="block text-foreground-secondary font-bold mb-1">Gig Title *</label>
              <div className="flex items-center rounded-xl border border-border bg-[#F8F9FD] overflow-hidden focus-within:border-brand-primary focus-within:bg-surface">
                <span className="px-3.5 py-2.5 bg-surface-sunken border-r border-border font-bold text-foreground-secondary select-none">
                  I will
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="perform and deliver this service"
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Category *</label>
                <select
                  value={selectedCategoryId || selectedCategoryName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = categories.find((c: any) => c.id === val || c.name === val);
                    if (found) {
                      setSelectedCategoryId(found.id);
                      setSelectedCategoryName(found.name);
                    } else {
                      setSelectedCategoryName(val);
                    }
                  }}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  {categories.map((c: any) => (
                    <option key={c.id || c.name} value={c.id || c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Listing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#F8F9FD] border border-border rounded-xl px-3 py-2.5 text-xs text-[#0F0C3B] font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE (Published to marketplace)</option>
                  <option value="PAUSED">PAUSED (Temporarily hidden)</option>
                  <option value="DRAFT">DRAFT (Not published)</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-foreground-secondary font-bold">Search Tags (up to 5)</label>
                <span className="text-foreground-muted">{tags.length} of 5</span>
              </div>
              <div className="p-2 rounded-xl border border-border bg-[#F8F9FD] flex flex-wrap gap-1.5 items-center">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-foreground flex items-center gap-1 shadow-xs"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-foreground-muted hover:text-danger font-bold ml-0.5 cursor-pointer"
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
                    className="bg-transparent text-xs text-[#0F0C3B] placeholder:text-foreground-muted focus:outline-none px-2 py-1 flex-1 min-w-[130px]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Package Tiers */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider">
              Package Tier Rates ($ USD)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-surface-elevated space-y-2">
                <span className="font-bold text-foreground-secondary block">Basic Tier</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">$</span>
                  <input
                    type="text"
                    value={basicPrice}
                    onChange={(e) => setBasicPrice(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 font-bold text-[#0F0C3B]"
                  />
                </div>
                <p className="text-[10px] text-foreground-muted">2 hours core coverage</p>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-300 bg-indigo-50/40 space-y-2 ring-2 ring-indigo-50">
                <span className="font-bold text-[#0F0C3B] block">Standard (Popular)</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">$</span>
                  <input
                    type="text"
                    value={standardPrice}
                    onChange={(e) => setStandardPrice(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 font-bold text-[#0F0C3B]"
                  />
                </div>
                <p className="text-[10px] text-foreground-muted">4 hours + full gear</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-surface-elevated space-y-2">
                <span className="font-bold text-foreground-secondary block">Premium VIP</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground-muted">$</span>
                  <input
                    type="text"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-1.5 font-bold text-[#0F0C3B]"
                  />
                </div>
                <p className="text-[10px] text-foreground-muted">6 hours + concert rig</p>
              </div>
            </div>
          </div>

          {/* Card 3: Description */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider">
              Service Description
            </h2>

            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your capabilities, workflow, equipment, and client experience..."
              className="w-full bg-[#F8F9FD] border border-border rounded-xl p-3.5 text-xs text-[#0F0C3B] focus:outline-none focus:border-brand-primary leading-relaxed"
            />
          </div>

          {/* Card 4: Gallery */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F0C3B] uppercase tracking-wider">
              Gallery &amp; Showcase Photos
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/mp4"
              onChange={onFileInputChange}
              className="hidden"
            />

            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                isDragging
                  ? "border-brand-primary bg-indigo-50/50 scale-[1.01]"
                  : "border-border bg-surface-elevated hover:border-brand-primary"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-xs flex items-center justify-center mb-2">
                {isUploadingFiles ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5 text-brand-primary" />
                )}
              </div>
              <p className="font-bold text-[#0F0C3B] text-xs">
                {isDragging ? "Drop images here" : "Drag & drop photos or click to browse"}
              </p>
              <p className="text-[10px] text-foreground-muted mt-0.5">JPG, PNG, WEBP up to 50MB</p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0F0C3B] text-foreground text-[10px] font-bold shadow-xs hover:bg-[#18124E] cursor-pointer"
                >
                  Choose From Computer
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground-secondary text-[10px] font-bold hover:bg-surface-elevated"
                >
                  Paste URL
                </button>
              </div>
            </div>

            {showUrlInput && (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste image link (https://...)"
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-[#0F0C3B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 rounded-lg bg-[#0F0C3B] text-foreground text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Current Photos ({galleryImages.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl border border-border overflow-hidden bg-surface-sunken aspect-video shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-[#0F0C3B] text-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-red-700 cursor-pointer"
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

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              href={`/vendor/gigs/${gigId}`}
              className="px-4 py-2 rounded-xl border border-border text-foreground-secondary font-bold hover:bg-surface-elevated transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-[#18124E] text-foreground font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-warning" />
              )}
              <span>Save &amp; Update Listing</span>
            </button>
          </div>
        </form>

        {/* Right Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between font-bold text-foreground-muted">
            <span className="flex items-center gap-1 text-[#0F0C3B]">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Live Card Preview
            </span>
            <span className="text-[10px] text-foreground-muted">Buyer View</span>
          </div>

          <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden text-xs">
            {coverImageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Gig cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-foreground text-[10px] font-bold uppercase">
                    {selectedCategoryName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#18124E] p-4 text-foreground flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-surface/10 text-[10px] font-bold uppercase">
                  {selectedCategoryName}
                </span>
                <span className="text-[10px] font-extrabold bg-warning-solid text-on-brand text-[#0F0C3B] px-2 py-0.5 rounded">
                  {status}
                </span>
              </div>
            )}

            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#0F0C3B] leading-snug line-clamp-2">
                  I will {title || "perform and deliver this service"}
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
                  <span className="text-xl font-extrabold text-[#0F0C3B]">
                    ${basicPrice || "450"}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-brand-primary">View Packages →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
