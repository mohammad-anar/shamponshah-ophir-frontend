"use client";

import { useState } from "react";
import { 
  Layers, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Percent, 
  Sparkles, 
  FolderTree,
  Eye,
  EyeOff,
  ShoppingBag,
  X,
  Save,
  Tag
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  takeRate: number; // e.g. 5%
  subcategories: string[];
  activeVendors: number;
  totalGigs: number;
  featured: boolean;
  status: "Active" | "Archived";
}

const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Music & Entertainment",
    slug: "music-entertainment",
    icon: "🎵",
    takeRate: 5.0,
    subcategories: ["Live Bands", "Wedding DJs", "Acoustic Soloists", "String Quartets", "Saxophonists", "Comedians"],
    activeVendors: 142,
    totalGigs: 380,
    featured: true,
    status: "Active",
  },
  {
    id: "cat-2",
    name: "Photography & Cinema",
    slug: "photography-cinema",
    icon: "📸",
    takeRate: 5.0,
    subcategories: ["Drone Aerial Video", "Wedding Photography", "Cinematic Film", "360 Photo Booths", "Portrait Sessions"],
    activeVendors: 198,
    totalGigs: 512,
    featured: true,
    status: "Active",
  },
  {
    id: "cat-3",
    name: "Catering & Bar Service",
    slug: "catering-bar",
    icon: "🍸",
    takeRate: 5.0,
    subcategories: ["Cocktail Mixologists", "Gourmet Food Trucks", "Plated Dinner Catering", "Artisan Dessert Bars", "Grazing Tables"],
    activeVendors: 95,
    totalGigs: 230,
    featured: true,
    status: "Active",
  },
  {
    id: "cat-4",
    name: "Decor & Floral Design",
    slug: "decor-florals",
    icon: "🌸",
    takeRate: 5.0,
    subcategories: ["Floral Arches & Centerpieces", "Luxury Drapery", "Balloon Installations", "LED Neon Signage", "Tablescape Styling"],
    activeVendors: 114,
    totalGigs: 290,
    featured: false,
    status: "Active",
  },
  {
    id: "cat-5",
    name: "Event Planning & Coordination",
    slug: "planning-coordination",
    icon: "📋",
    takeRate: 5.0,
    subcategories: ["Full-Service Wedding Planner", "Day-Of Coordinator", "Corporate Summit Logistics", "Birthday Party Host"],
    activeVendors: 76,
    totalGigs: 165,
    featured: true,
    status: "Active",
  },
  {
    id: "cat-6",
    name: "Venues & Spaces",
    slug: "venues-spaces",
    icon: "🏰",
    takeRate: 3.5,
    subcategories: ["Rooftop Terraces", "Historic Mansions", "Rustic Barns", "Waterfront Pavilions", "Industrial Lofts"],
    activeVendors: 42,
    totalGigs: 88,
    featured: false,
    status: "Active",
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("✨");
  const [newCatTakeRate, setNewCatTakeRate] = useState(5);
  const [newSubcats, setNewSubcats] = useState("");

  const filtered = categories.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subcategories.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === "Active" ? "Archived" : "Active";
        toast.info(`Category "${c.name}" marked as ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleToggleFeatured = (id: string) => {
    setCategories(categories.map((c) => {
      if (c.id === id) {
        const nextFeatured = !c.featured;
        toast.success(nextFeatured ? `"${c.name}" featured on Homepage.` : `"${c.name}" removed from Homepage featured.`);
        return { ...c, featured: nextFeatured };
      }
      return c;
    }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, "-"),
      icon: newCatIcon,
      takeRate: newCatTakeRate,
      subcategories: newSubcats.split(",").map((s) => s.trim()).filter(Boolean),
      activeVendors: 0,
      totalGigs: 0,
      featured: false,
      status: "Active",
    };
    setCategories([...categories, newCat]);
    setIsNewModalOpen(false);
    setNewCatName("");
    setNewSubcats("");
    toast.success(`Category "${newCat.name}" added successfully.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    toast.success(`Category "${editingCategory.name}" updated successfully.`);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">
              Taxonomy &amp; Category Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B] border border-indigo-200">
              {categories.length} Active Clusters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage marketplace categories, sub-skills, default buyer take rates, and featured search promotions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-300" /> Add New Category
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search category or subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Global Baseline Take Rate:</span>
          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            5.0% Buyer + 10.0% Vendor
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {filtered.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white border border-slate-200 hover:border-brand-primary/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-xs">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0F0C3B] flex items-center gap-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">/{cat.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleToggleFeatured(cat.id)}
                    className={cn(
                      "p-1.5 rounded-xl transition-colors",
                      cat.featured ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-400 hover:text-slate-700"
                    )}
                    title={cat.featured ? "Featured on Homepage" : "Set Featured"}
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </button>

                  <button 
                    onClick={() => handleToggleStatus(cat.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100"
                    title={cat.status === "Active" ? "Archive" : "Activate"}
                  >
                    {cat.status === "Active" ? <Eye className="w-3.5 h-3.5 text-brand-primary" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 bg-[#F8F9FD] p-2.5 rounded-2xl border border-slate-100 text-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vendors</p>
                  <p className="text-xs font-black text-[#0F0C3B] mt-0.5">{cat.activeVendors}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Live Gigs</p>
                  <p className="text-xs font-black text-[#0F0C3B] mt-0.5">{cat.totalGigs}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Take Rate</p>
                  <p className="text-xs font-black text-brand-primary mt-0.5 font-mono">{cat.takeRate}%</p>
                </div>
              </div>

              {/* Subcategories tags */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Subcategories ({cat.subcategories.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                cat.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                {cat.status}
              </span>
              <button
                onClick={() => setEditingCategory(cat)}
                className="text-xs text-[#0F0C3B] hover:text-brand-primary font-bold flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-primary" /> Edit Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Category Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-800 shadow-2xl animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0F0C3B] flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-brand-primary" /> Create New Taxonomy Category
              </h2>
              <button 
                onClick={() => setIsNewModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2 text-center text-lg focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-slate-700 font-bold mb-1">Category Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Transportation"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategories (comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="Limousine Service, Vintage Cars, Party Buses, Helicopter Charter"
                  value={newSubcats}
                  onChange={(e) => setNewSubcats(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Platform Buyer Fee (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newCatTakeRate}
                  onChange={(e) => setNewCatTakeRate(Number(e.target.value))}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" /> Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-800 shadow-2xl animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0F0C3B] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-primary" /> Edit {editingCategory.name}
              </h2>
              <button 
                onClick={() => setEditingCategory(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon</label>
                  <input
                    type="text"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2 text-center text-lg focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-slate-700 font-bold mb-1">Category Title</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategories (comma separated)</label>
                <textarea
                  rows={3}
                  value={editingCategory.subcategories.join(", ")}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    subcategories: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                  })}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Platform Buyer Fee (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingCategory.takeRate}
                  onChange={(e) => setEditingCategory({ ...editingCategory, takeRate: Number(e.target.value) })}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F0C3B] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
