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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8F9FD]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-brand-primary">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#0F0C3B]">Recommend to Family Hub</h3>
              <p className="text-[11px] text-slate-500">Collaborate with family members before booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Service Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{service.category}</span>
              <h4 className="text-xs font-bold text-[#0F0C3B] mt-0.5">{service.name}</h4>
              <p className="text-[11px] text-slate-500">By {service.vendorName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-base font-black text-[#0F0C3B]">
                ${service.price.toLocaleString()}
              </span>
              {service.priceUnit && (
                <span className="text-[10px] text-slate-400 block">/ {service.priceUnit}</span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Target Family Hub */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Target Family Workspace
              </label>
              <div className="p-3 rounded-2xl bg-[#EDE9FE]/50 border border-brand-primary/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                    {hubName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#0F0C3B]">{hubName}</p>
                    <p className="text-[10px] text-slate-500">
                      {membersCount} family member{membersCount === 1 ? "" : "s"} active
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-brand-primary border border-indigo-200">
                  Active Hub
                </span>
              </div>
            </div>

            {/* Note to Family Members */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recommendation Note for Family Members
              </label>
              <textarea
                rows={3}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Why do you recommend this service?"
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            {isAlreadyAdded ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>This service is already recommended in your Family Hub. Each service can only be added once.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-2 text-[11px] text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                <span>All family members can review, upvote, or book this service with 100% milestone escrow protection.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding || isSuccess || isAlreadyAdded}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                  isAlreadyAdded
                    ? "bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed"
                    : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                }`}
              >
                {isAlreadyAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Already in Family Hub</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
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
