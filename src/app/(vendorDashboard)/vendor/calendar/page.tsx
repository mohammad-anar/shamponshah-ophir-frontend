"use client";

import { useState } from "react";
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

interface CalendarEvent {
  id: string;
  date: number; // day of current month (e.g. 15)
  title: string;
  time: string;
  client: string;
  location: string;
  status: "CONFIRMED" | "PENDING" | "BLOCKED";
  amount?: number;
}

const initialEvents: CalendarEvent[] = [
  { id: "e1", date: 2, title: "Sarah Jenkins Wedding Reception", time: "5:00 PM – 10:00 PM", client: "Sarah Jenkins", location: "Chicago, IL", status: "CONFIRMED", amount: 1200 },
  { id: "e2", date: 8, title: "David Vance Anniversary Party", time: "7:00 PM – 11:00 PM", client: "David Vance", location: "Naperville, IL", status: "CONFIRMED", amount: 850 },
  { id: "e3", date: 15, title: "Emily & David's Golden Ophir Wedding", time: "4:00 PM – 11:30 PM", client: "Emily Carter", location: "Lakefront Pavilion, Chicago", status: "CONFIRMED", amount: 1600 },
  { id: "e4", date: 22, title: "Vacation / Personal Blockout", time: "All Day", client: "Personal", location: "Unavailable", status: "BLOCKED" },
  { id: "e5", date: 28, title: "Marcus Taylor Birthday Celebration", time: "2:00 PM – 6:00 PM", client: "Marcus Taylor", location: "Evanston, IL", status: "PENDING", amount: 650 },
];

export default function VendorCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("October 2025");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<number | null>(15);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDayNumber, setBlockDayNumber] = useState(25);
  const [blockReason, setBlockReason] = useState("Studio Maintenance & Gear Check");

  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday start

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlock: CalendarEvent = {
      id: `b-${Date.now()}`,
      date: Number(blockDayNumber),
      title: blockReason,
      time: "All Day",
      client: "Personal Block",
      location: "Unavailable",
      status: "BLOCKED",
    };
    setEvents([...events, newBlock]);
    setShowBlockModal(false);
  };

  const selectedDayEvents = events.filter((e) => e.date === selectedDay);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0F0C3B] tracking-tight">Calendar & Event Availability</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#0F0C3B]">
              4 Booked Dates
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your booked performance schedule, block off vacation dates, and sync external Google/iCal calendars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0F0C3B] hover:bg-indigo-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Block Unavailable Dates
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Month Grid + Day Schedule Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive 31-Day Month Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-black text-[#0F0C3B]">{currentMonth}</h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-2 border-y border-slate-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset days */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-20 sm:h-24 p-1.5 bg-slate-50/50 rounded-xl opacity-40" />
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
                      ? "border-brand-primary bg-indigo-50/50 ring-2 ring-brand-primary/30"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? "text-brand-primary font-black" : "text-slate-700"}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className={`w-2 h-2 rounded-full ${
                        hasConfirmed ? "bg-emerald-500" : hasBlocked ? "bg-rose-500" : "bg-amber-500"
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
                            ? "bg-emerald-100 text-emerald-900"
                            : evt.status === "BLOCKED"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 1 && (
                      <span className="text-[8px] text-slate-400 font-bold block">
                        +{dayEvents.length - 1} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Confirmed Booking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pending Offer / Hold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Blocked / Vacation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Day Schedule & Event Details */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Day Schedule</span>
              <h3 className="text-base font-black text-[#0F0C3B]">
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
                        ? "bg-emerald-50/50 border-emerald-200"
                        : evt.status === "BLOCKED"
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-amber-50/50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        evt.status === "CONFIRMED" ? "bg-emerald-200 text-emerald-900" :
                        evt.status === "BLOCKED" ? "bg-rose-200 text-rose-900" :
                        "bg-amber-200 text-amber-900"
                      }`}>
                        {evt.status}
                      </span>
                      {evt.amount && (
                        <span className="font-mono font-bold text-xs text-slate-800">
                          ${evt.amount} Escrow
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#0F0C3B]">{evt.title}</h4>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F8F9FD] rounded-xl border border-dashed border-slate-200 space-y-2">
                <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">Date is Open & Available</p>
                <p className="text-[11px] text-slate-400">Clients can book instant gigs or submit job invitations for this day.</p>
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
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F0C3B] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Block This Day
          </button>
        </div>
      </div>

      {/* Block Date Range Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0F0C3B] flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" /> Block Calendar Date
              </h2>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Day (October 2025)</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={blockDayNumber}
                  onChange={(e) => setBlockDayNumber(Number(e.target.value))}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Blackout</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Private Wedding, Family Vacation, Equipment Maintenance"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full bg-[#F8F9FD] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Clients searching for services on this date will see your status as "Fully Booked".
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
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
