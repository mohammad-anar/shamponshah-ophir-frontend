"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  FolderTree,
  Eye,
  EyeOff,
  X,
  Save,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  useGetAdminCategoriesQuery, 
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/service/categories/categoriesApi";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  image?: string | null;
  description?: string | null;
  order?: number;
  sortOrder?: number;
  isActive: boolean;
  subcategories: string[];
  activeVendors: number;
  totalGigs: number;
  totalJobs: number;
}

export default function AdminCategoriesPage() {
  const { data: apiCategories, isLoading, isError, refetch } = useGetAdminCategoriesQuery();
  const [createCategoryMutation, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategoryMutation, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategoryMutation, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories: CategoryItem[] = (apiCategories && Array.isArray(apiCategories))
    ? apiCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || "✨",
        image: c.image || null,
        description: c.description || "",
        order: c.order ?? c.sortOrder ?? 0,
        sortOrder: c.sortOrder ?? c.order ?? 0,
        isActive: c.isActive !== false,
        subcategories: (c.children || c.subCategories || [])?.map((s: any) => typeof s === "string" ? s : s.name) || [],
        activeVendors: c._count?.vendorCategories || 0,
        totalGigs: c._count?.gigs || 0,
        totalJobs: c._count?.jobs || 0,
      }))
    : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("✨");
  const [newCatImage, setNewCatImage] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatOrder, setNewCatOrder] = useState(0);

  const filtered = categories.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subcategories.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategoryMutation({
        id,
        data: { isActive: !currentStatus },
      }).unwrap();
      refetch();
      toast.success(!currentStatus ? "Category activated." : "Category deactivated/archived.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update category status.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Category title is required.");
      return;
    }
    const slug = newCatName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    try {
      await createCategoryMutation({
        name: newCatName.trim(),
        slug,
        icon: newCatIcon.trim() || "✨",
        image: newCatImage.trim() || undefined,
        description: newCatDesc.trim() || `All services related to ${newCatName.trim()}`,
        order: Number(newCatOrder) || 0,
        sortOrder: Number(newCatOrder) || 0,
      }).unwrap();
      refetch();
      toast.success(`Category "${newCatName.trim()}" created successfully.`);
      setIsNewModalOpen(false);
      setNewCatName("");
      setNewCatIcon("✨");
      setNewCatImage("");
      setNewCatDesc("");
      setNewCatOrder(0);
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to create category "${newCatName}".`);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      toast.error("Category title cannot be empty.");
      return;
    }
    try {
      await updateCategoryMutation({
        id: editingCategory.id,
        data: {
          name: editingCategory.name.trim(),
          slug: editingCategory.slug.trim(),
          icon: editingCategory.icon?.trim() || "✨",
          image: editingCategory.image?.trim() || undefined,
          description: editingCategory.description?.trim(),
          order: Number(editingCategory.order) || 0,
          sortOrder: Number(editingCategory.order) || 0,
          isActive: editingCategory.isActive,
        },
      }).unwrap();
      refetch();
      toast.success(`Category "${editingCategory.name}" updated successfully.`);
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update category.");
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await deleteCategoryMutation(cat.id).unwrap();
      refetch();
      toast.success(`Category "${cat.name}" deleted successfully.`);
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Cannot delete category.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Taxonomy &amp; Category Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand/15 text-brand border border-border-brand/40">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage marketplace service categories, active/inactive visibility, and taxonomy hierarchy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-on-brand" /> Add New Category
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-surface border border-border rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search category or subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <span>Marketplace Commission:</span>
          <span className="font-mono font-bold text-success bg-success-solid text-foreground/15 px-2.5 py-0.5 rounded-full border border-success/30">
            15% Platform Fee
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-surface border border-border rounded-3xl p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-surface-elevated" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-surface-elevated rounded-md w-3/4" />
                  <div className="h-3 bg-surface-sunken rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-surface-elevated rounded-2xl" />
              <div className="h-4 bg-surface-elevated rounded-md w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <div className="bg-danger-solid text-foreground/10 border border-danger/30 rounded-3xl p-8 text-center text-danger space-y-3">
          <AlertCircle className="w-8 h-8 text-danger mx-auto" />
          <p className="font-bold text-sm">Failed to load marketplace categories</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-danger-solid text-foreground text-foreground rounded-xl text-xs font-bold hover:bg-danger-solid text-foreground transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="bg-surface border border-border rounded-3xl p-12 text-center text-foreground-muted space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-brand">
            <FolderTree className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-black text-foreground">No Categories Created Yet</h3>
            <p className="text-xs text-foreground-muted">
              Create the initial service categories so vendors can register gigs and clients can submit targeted jobs.
            </p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-on-brand" /> Create First Category
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {filtered.map((cat) => (
            <div 
              key={cat.id}
              className={cn(
                "bg-surface border rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-lg transition-all",
                cat.isActive ? "border-border hover:border-border-brand/40" : "border-border/60 bg-surface/60 opacity-75"
              )}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-xl shadow-xs">
                      {cat.icon || "✨"}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-foreground flex items-center gap-1.5">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] font-mono text-foreground-muted">/{cat.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToggleStatus(cat.id, cat.isActive)}
                      className={cn(
                        "p-1.5 rounded-xl transition-colors cursor-pointer border",
                        cat.isActive ? "bg-success-solid text-foreground/15 text-success hover:bg-success-solid text-foreground/25 border-success/30" : "bg-surface-elevated text-foreground-muted hover:text-foreground-secondary border-border"
                      )}
                      title={cat.isActive ? "Deactivate (Hide from Vendor & Search)" : "Activate Category"}
                    >
                      {cat.isActive ? <Eye className="w-3.5 h-3.5 text-success" /> : <EyeOff className="w-3.5 h-3.5 text-foreground-muted" />}
                    </button>
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-foreground-muted mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-surface-elevated p-2.5 rounded-2xl border border-border text-center">
                  <div>
                    <p className="text-[10px] font-bold text-foreground-muted uppercase">Live Gigs</p>
                    <p className="text-xs font-black text-foreground mt-0.5">{cat.totalGigs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground-muted uppercase">Open Jobs</p>
                    <p className="text-xs font-black text-foreground mt-0.5">{cat.totalJobs}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground-muted uppercase">Order Priority</p>
                    <p className="text-xs font-black text-brand mt-0.5 font-mono">{cat.order}</p>
                  </div>
                </div>

                {/* Subcategories tags */}
                {cat.subcategories.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                      Subcategories ({cat.subcategories.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-surface-elevated text-foreground-secondary border border-border text-[11px] font-semibold">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                  cat.isActive ? "bg-success-solid text-foreground/15 text-success border-success/30" : "bg-surface-elevated text-foreground-muted border-border"
                )}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="text-xs text-foreground-secondary hover:text-brand font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={isDeleting}
                    className="text-xs text-danger hover:text-danger font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    title={cat.totalGigs > 0 || cat.totalJobs > 0 ? "Cannot delete category in use (deactivate instead)" : "Delete category"}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Category Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 text-foreground-secondary shadow-2xl animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-black text-foreground flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-brand" /> Create New Service Category
              </h2>
              <button 
                onClick={() => setIsNewModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-surface-elevated hover:bg-surface-sunken text-foreground-muted hover:text-foreground flex items-center justify-center border border-border transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2 text-center text-lg text-foreground focus:outline-none focus:border-border-brand"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-foreground-muted font-bold mb-1">Category Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Photography & Cinema"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-bold placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground-muted font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Professional photography, videography, and drone event coverage..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Banner Image URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-border-brand"
                  />
                </div>
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={newCatOrder}
                    onChange={(e) => setNewCatOrder(Number(e.target.value))}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary rounded-xl text-xs font-bold border border-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5 text-on-brand" />}
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 text-foreground-secondary shadow-2xl animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-black text-foreground flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand" /> Edit {editingCategory.name}
              </h2>
              <button 
                onClick={() => setEditingCategory(null)} 
                className="w-8 h-8 rounded-full bg-surface-elevated hover:bg-surface-sunken text-foreground-muted hover:text-foreground flex items-center justify-center border border-border transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Icon</label>
                  <input
                    type="text"
                    value={editingCategory.icon || "✨"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2 text-center text-lg text-foreground focus:outline-none focus:border-border-brand"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-foreground-muted font-bold mb-1">Category Title</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-bold focus:outline-none focus:border-border-brand"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground-muted font-bold mb-1">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-border-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-foreground-muted font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-border-brand resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={editingCategory.image || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-border-brand"
                  />
                </div>
                <div>
                  <label className="block text-foreground-muted font-bold mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingCategory.order ?? 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none focus:border-border-brand"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="categoryActiveToggle"
                  checked={editingCategory.isActive}
                  onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-brand focus:ring-focus-ring bg-surface-elevated border-border cursor-pointer"
                />
                <label htmlFor="categoryActiveToggle" className="text-xs font-bold text-foreground-secondary cursor-pointer">
                  Active (Visible to vendors and clients)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-surface-elevated hover:bg-surface-sunken text-foreground-secondary rounded-xl text-xs font-bold border border-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-on-brand" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
