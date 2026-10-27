"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Lock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  MapPin,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetBlockedDatesQuery, useAddBlockedDateMutation, useRemoveBlockedDateMutation } from "@/redux/service/vendors/vendorsApi";
import { useGetVendorOrdersQuery } from "@/redux/service/orders/ordersApi";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  date: number; // day of current month (e.g. 15)
  title: string;
  time: string;
  client: string;
  location: string;
  status: "CONFIRMED" | "PENDING" | "BLOCKED";
  amount?: number;
  dbId?: string;
}

const initialEvents: CalendarEvent[] = [
  { id: "e1", date: 2, title: "Sarah Jenkins Wedding Reception", time: "5:00 PM – 10:00 PM", client: "Sarah Jenkins", location: "Chicago, IL", status: "CONFIRMED", amount: 1200 },
  { id: "e2", date: 8, title: "David Vance Anniversary Party", time: "7:00 PM – 11:00 PM", client: "David Vance", location: "Naperville, IL", status: "CONFIRMED", amount: 850 },
  { id: "e3", date: 15, title: "Emily & David's Golden Ophir Wedding", time: "4:00 PM – 11:30 PM", client: "Emily Carter", location: "Lakefront Pavilion, Chicago", status: "CONFIRMED", amount: 1600 },
  { id: "e4", date: 22, title: "Vacation / Personal Blockout", time: "All Day", client: "Personal", location: "Unavailable", status: "BLOCKED" },
  { id: "e5", date: 28, title: "Marcus Taylor Birthday Celebration", time: "2:00 PM – 6:00 PM", client: "Marcus Taylor", location: "Evanston, IL", status: "PENDING", amount: 650 },
];

export default function VendorCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDayNumber, setBlockDayNumber] = useState(new Date().getDate());
  const [blockReason, setBlockReason] = useState("");

  const { data: blockedDatesData } = useGetBlockedDatesQuery();
  const { data: ordersData } = useGetVendorOrdersQuery();
  const [addBlockedDate] = useAddBlockedDateMutation();
  const [removeBlockedDate] = useRemoveBlockedDateMutation();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOffset = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthLabel = currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  // Sync real database orders and blocked dates
  useEffect(() => {
    const rawBlocked = (blockedDatesData as any)?.data || (Array.isArray(blockedDatesData) ? blockedDatesData : []);
    const rawOrders = (ordersData as any)?.data?.orders || (ordersData as any)?.orders || [];

    const mappedEvents: CalendarEvent[] = [];

    if (Array.isArray(rawOrders) && rawOrders.length > 0) {
      rawOrders.forEach((ord: any, idx: number) => {
        if (!ord.eventDate) return;
        const eventDate = new Date(ord.eventDate);
        if (eventDate.getMonth() !== currentMonth.getMonth() || eventDate.getFullYear() !== currentMonth.getFullYear()) return;
        const d = eventDate.getDate();
        mappedEvents.push({
          id: `ord-${ord.id}`,
          date: d > 0 && d <= 31 ? d : 12,
          title: ord.service || ord.gig?.title || `Event Order #${ord.orderNumber}`,
          time: "4:00 PM – 10:00 PM",
          client: ord.client || ord.clientProfile?.displayName || "Verified Client",
          location: "Chicago, IL",
          status: "CONFIRMED",
          amount: Number(ord.grandTotal || ord.subtotal || 0),
        });
      });
    }

    if (Array.isArray(rawBlocked) && rawBlocked.length > 0) {
      rawBlocked.forEach((b: any) => {
        const blockedDate = new Date(b.date);
        if (blockedDate.getMonth() !== currentMonth.getMonth() || blockedDate.getFullYear() !== currentMonth.getFullYear()) return;
        const d = blockedDate.getDate();
        mappedEvents.push({
          id: `b-${b.id}`,
          dbId: b.id,
          date: d > 0 && d <= 31 ? d : 22,
          title: b.reason || "Blocked Date",
          time: "All Day",
          client: "Personal Block",
          location: "Unavailable",
          status: "BLOCKED",
        });
      });
    }

    setEvents(mappedEvents);
  }, [blockedDatesData, ordersData, currentMonth]);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBlockedDate({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Number(blockDayNumber)).toISOString(),
        reason: blockReason,
      }).unwrap();
      toast.success("Date blocked.");
      setShowBlockModal(false);
      setBlockReason("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not block this date.");
    }
  };

  const handleRemoveBlock = async (event: CalendarEvent) => {
    if (event.dbId) {
      try {
        await removeBlockedDate(event.dbId).unwrap();
        toast.success("Date unblocked!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Could not unblock date.");
      }
    }
  };

  const selectedDayEvents = events.filter((e) => e.date === selectedDay);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Calendar & Event Availability</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-soft text-foreground">
              4 Booked Dates
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage your booked performance schedule, block off vacation dates, and sync external Google/iCal calendars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand hover:bg-info-soft text-foreground text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Lock className="w-3.5 h-3.5 text-warning" /> Block Unavailable Dates
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Month Grid + Day Schedule Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive 31-Day Month Calendar Grid */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-black text-foreground">{monthLabel}</h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1.5 rounded-lg border border-border hover:bg-surface-elevated text-foreground-secondary">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1.5 rounded-lg border border-border hover:bg-surface-elevated text-foreground-secondary">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-foreground-muted uppercase py-2 border-y border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset days */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-20 sm:h-24 p-1.5 bg-surface-elevated/50 rounded-xl opacity-40" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayEvents = events.filter((e) => e.date === dayNum);
              const isSelected = selectedDay === dayNum;
              const hasConfirmed = dayEvents.some((e) => e.status === "CONFIRMED");
              const hasBlocked = dayEvents.some((e) => e.status === "BLOCKED");

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-20 sm:h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-brand-primary bg-info-soft/50 ring-2 ring-brand-primary/30"
                      : "border-border hover:border-border hover:bg-surface-elevated"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? "text-brand-primary font-black" : "text-foreground-secondary"}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className={`w-2 h-2 rounded-full ${
                        hasConfirmed ? "bg-success-solid text-foreground" : hasBlocked ? "bg-danger-solid text-foreground" : "bg-warning-solid text-on-brand"
                      }`} />
                    )}
                  </div>

                  {/* Day Events preview pill */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 1).map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-[9px] font-bold p-1 rounded-md truncate leading-tight ${
                          evt.status === "CONFIRMED"
                            ? "bg-success-soft text-success"
                            : evt.status === "BLOCKED"
                            ? "bg-danger-soft text-danger"
                            : "bg-warning-soft text-warning"
                        }`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 1 && (
                      <span className="text-[8px] text-foreground-muted font-bold block">
                        +{dayEvents.length - 1} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border text-xs text-foreground-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success-solid text-foreground" />
              <span>Confirmed Booking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-warning-solid text-on-brand" />
              <span>Pending Offer / Hold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger-solid text-foreground" />
              <span>Blocked / Vacation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Day Schedule & Event Details */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <span className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">Day Schedule</span>
              <h3 className="text-base font-black text-foreground">
                {selectedDay ? `October ${selectedDay}, 2025` : "Select a date"}
              </h3>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      evt.status === "CONFIRMED"
                        ? "bg-success-soft/50 border-success/30"
                        : evt.status === "BLOCKED"
                        ? "bg-danger-soft/50 border-danger/30"
                        : "bg-warning-soft/50 border-warning/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        evt.status === "CONFIRMED" ? "bg-emerald-200 text-success" :
                        evt.status === "BLOCKED" ? "bg-rose-200 text-danger" :
                        "bg-warning-soft text-warning"
                      }`}>
                        {evt.status}
                      </span>
                      {evt.amount && (
                        <span className="font-mono font-bold text-xs text-foreground">
                          ${evt.amount} Escrow
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-foreground">{evt.title}</h4>

                    <div className="space-y-1 text-[11px] text-foreground-secondary">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-surface-elevated rounded-xl border border-dashed border-border space-y-2">
                <CalendarIcon className="w-8 h-8 text-foreground-secondary mx-auto" />
                <p className="text-xs font-bold text-foreground-secondary">Date is Open & Available</p>
                <p className="text-[11px] text-foreground-muted">Clients can book instant gigs or submit job invitations for this day.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (selectedDay) {
                setBlockDayNumber(selectedDay);
                setShowBlockModal(true);
              }
            }}
            className="w-full py-2.5 bg-surface-sunken hover:bg-surface-sunken text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Block This Day
          </button>
        </div>
      </div>

      {/* Block Date Range Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-danger" /> Block Calendar Date
              </h2>
              <button onClick={() => setShowBlockModal(false)} className="text-foreground-muted hover:text-foreground-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Select Day (October 2025)</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={blockDayNumber}
                  onChange={(e) => setBlockDayNumber(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-foreground-secondary font-bold mb-1">Reason for Blackout</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Private Wedding, Family Vacation, Equipment Maintenance"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="p-3 bg-warning-soft rounded-xl border border-warning/30 text-[11px] text-warning">
                Clients searching for services on this date will see your status as "Fully Booked".
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 bg-surface-sunken hover:bg-surface-sunken text-foreground-secondary rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-danger-solid text-white hover:bg-danger-solid text-white text-foreground rounded-xl font-bold"
                >
                  Apply Date Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
