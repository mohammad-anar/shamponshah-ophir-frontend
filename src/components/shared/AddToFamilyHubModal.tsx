"use client";

import { useState } from "react";
import { 
  Users2, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useGetWorkspaceQuery, useAddBoardItemMutation } from "@/redux/service/family-hub/familyHubApi";

interface AddToFamilyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    category: string;
    price: number;
    priceUnit?: string;
    vendorName: string;
    image?: string;
  };
}

export default function AddToFamilyHubModal({
  isOpen,
  onClose,
  service,
}: AddToFamilyHubModalProps) {
  const { data: wsData, isLoading: isWsLoading } = useGetWorkspaceQuery();
  const [addBoardItem, { isLoading: isAdding }] = useAddBoardItemMutation();
  const [personalNote, setPersonalNote] = useState(
    `Hey everyone! I found this amazing ${service.category} service by ${service.vendorName}. What do you think about booking them for our family?`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const ws = wsData?.data || wsData;
  const primaryBoard = ws?.boards?.[0];
  const hubName = ws?.name || "Family Collaboration Hub";
  const membersCount = (ws?.members?.length || 0) + 1;

  const existingItems = primaryBoard?.items || [];
  const isAlreadyAdded = existingItems.some(
    (item: any) =>
      (service.id && (item.gigId === service.id || item.id === service.id)) ||
      item.title?.toLowerCase().trim() === service.name?.toLowerCase().trim()
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyAdded) {
      toast.error("This service has already been added to your Family Hub");
      return;
    }

    const targetBoardId = primaryBoard?.id || "primary";

    try {
      await addBoardItem({
        boardId: targetBoardId,
        data: {
          gigId: service.id,
          title: service.name,
          notes: JSON.stringify({
            price: service.price,
            vendorName: service.vendorName,
            category: service.category,
            image: service.image,
            note: personalNote,
          }),
          status: "SHORTLISTED",
        },
      }).unwrap();

      setIsSuccess(true);
      toast.success(`Added "${service.name}" to ${hubName}!`);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add service to Family Hub");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121418] rounded-none max-w-lg w-full shadow-2xl overflow-hidden border border-[#26282E] animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#26282E] flex items-center justify-between bg-[#0B0C0E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#1A1D24] text-[#DFB76C] border border-[#26282E]">
              <Users2 className="w-5 h-5 text-[#DFB76C]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Recommend to Collaborative Hub</h3>
              <p className="text-[11px] text-slate-400">Collaborate with family before securing reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Service Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-none bg-[#0B0C0E] border border-[#26282E] flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-bold text-[#DFB76C] uppercase tracking-widest">{service.category}</span>
              <h4 className="text-xs font-bold text-white mt-0.5">{service.name}</h4>
              <p className="text-[11px] text-slate-400">By {service.vendorName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-base font-mono font-bold text-[#DFB76C]">
                ${service.price.toLocaleString()}
              </span>
              {service.priceUnit && (
                <span className="text-[10px] text-slate-500 block">/ {service.priceUnit}</span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Target Family Hub */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
                Target Collaborative Workspace
              </label>
              <div className="p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-[#DFB76C] text-[#0B0C0E] flex items-center justify-center font-bold text-xs">
                    {hubName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">{hubName}</p>
                    <p className="text-[10px] text-slate-400">
                      {membersCount} family member{membersCount === 1 ? "" : "s"} active
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-[#1A1D24] text-[#DFB76C] border border-[#DFB76C]/30 uppercase tracking-wider">
                  Active Hub
                </span>
              </div>
            </div>

            {/* Note to Family Members */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                Recommendation Note for Family Members
              </label>
              <textarea
                rows={3}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Why do you recommend this artisan?"
                className="w-full bg-[#0B0C0E] border border-[#26282E] rounded-none p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#DFB76C] resize-none"
              />
            </div>

            {isAlreadyAdded ? (
              <div className="p-3 rounded-none bg-[#222018] border border-amber-500/40 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>This service is already recommended in your Collaborative Hub.</span>
              </div>
            ) : (
              <div className="p-3 rounded-none bg-[#0B0C0E] border border-[#26282E] flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>All family members can review, collaborate, and reserve with 100% milestone escrow protection.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#26282E]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding || isSuccess || isAlreadyAdded}
                className={`px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                  isAlreadyAdded
                    ? "bg-[#1A1D24] text-slate-500 border border-[#26282E] cursor-not-allowed"
                    : "bg-[#DFB76C] hover:bg-[#ECC870] text-[#0B0C0E] shadow-gold-glow-sm"
                }`}
              >
                {isAlreadyAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Already in Hub</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0B0C0E]" />
                    <span>Added to Hub!</span>
                  </>
                ) : isAdding ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Recommend Service</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
