"use client";

import { useState } from "react";
import { 
  Users2, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  DollarSign, 
  ShoppingBag, 
  Heart,
  MessageSquare,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface JoinedFamilyHub {
  id: string;
  name: string;
  role: string;
  membersCount: number;
  eventDate: string;
}

const mockJoinedHubs: JoinedFamilyHub[] = [
  { id: "hub-1", name: "Emily & David's Golden Ophir Wedding", role: "Host / Admin", membersCount: 4, eventDate: "Nov 15, 2025" },
  { id: "hub-2", name: "Miller 40th Birthday Bash", role: "Co-Planner", membersCount: 6, eventDate: "Dec 08, 2025" },
  { id: "hub-3", name: "Carter Family Holiday Gala", role: "Family Member", membersCount: 8, eventDate: "Dec 24, 2025" },
];

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
  const [selectedHubId, setSelectedHubId] = useState(mockJoinedHubs[0].id);
  const [personalNote, setPersonalNote] = useState(
    `Hey everyone! I found this amazing ${service.category} service by ${service.vendorName}. What do you think about booking them for our event?`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHub = mockJoinedHubs.find((h) => h.id === selectedHubId);
    setIsSuccess(true);
    toast.success(`Added "${service.name}" to ${targetHub?.name}! All members can now vote and co-pay.`);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
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
              <h3 className="text-sm font-bold text-[#0F0C3B]">Add Service to Family Hub</h3>
              <p className="text-[11px] text-slate-500">Collaborative voting & co-payment board</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
            {/* Select Destination Family Hub */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Choose Family Hub / Celebration Workspace *
              </label>
              <div className="space-y-2">
                {mockJoinedHubs.map((hub) => {
                  const isSelected = selectedHubId === hub.id;
                  return (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedHubId(hub.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#EDE9FE] border-brand-primary ring-1 ring-brand-primary"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-700"
                        }`}>
                          {hub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#0F0C3B]">{hub.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {hub.membersCount} family members &bull; Event: {hub.eventDate}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                        {hub.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note to Family Members */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pitch Note to Family Members (Optional)
              </label>
              <textarea
                rows={3}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Why do you recommend this vendor?"
                className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-2 text-[11px] text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span>All members can cast votes and contribute partial payments securely via Stripe.</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSuccess}
                className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/25 flex items-center gap-1.5"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Added to Hub!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Add to Family Hub</span>
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
