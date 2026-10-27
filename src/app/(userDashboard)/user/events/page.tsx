"use client";

import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Loader2 } from "lucide-react";
import { useGetClientOrdersQuery } from "@/redux/service/orders/ordersApi";

export default function UserEventsPage() {
  const { data, isLoading, isError, refetch } = useGetClientOrdersQuery();
  const orders = Array.isArray(data) ? data : data?.data?.orders || data?.orders || data?.data || [];
  const datedOrders = orders.filter((order: any) => order.eventDate).sort((a: any, b: any) =>
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-[#0F0C3B]">My Events</h1>
        <p className="mt-1 text-sm text-foreground-muted">Event dates from your service orders.</p>
      </header>
      {isLoading ? <div className="flex items-center gap-2 py-12 text-sm text-foreground-muted"><Loader2 className="h-4 w-4 animate-spin" />Loading events…</div>
        : isError ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Could not load events. <button className="font-bold underline" onClick={() => refetch()}>Retry</button></div>
        : datedOrders.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center"><CalendarDays className="mx-auto mb-3 h-8 w-8 text-foreground-secondary" /><h2 className="font-semibold text-foreground">No event dates yet</h2><p className="mt-1 text-sm text-foreground-muted">Event dates appear here after you place an order.</p><Link href="/services" className="mt-4 inline-block rounded-lg bg-[#0F0C3B] px-4 py-2 text-sm font-semibold text-foreground">Browse services</Link></div>
        : <div className="space-y-3">{datedOrders.map((order: any) => <Link key={order.id} href={`/user/orders/${order.id}`} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-indigo-300 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-[#0F0C3B]">{order.gig?.title || order.package?.title || `Order ${order.orderNumber}`}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-foreground-muted"><MapPin className="h-4 w-4" />{order.event?.location || order.deliveryNotes || "Location not provided"}</p></div><div className="flex items-center gap-2 text-sm font-medium text-foreground-secondary"><Clock3 className="h-4 w-4 text-info" />{new Date(order.eventDate).toLocaleString()}</div></Link>)}</div>}
    </div>
  );
}
