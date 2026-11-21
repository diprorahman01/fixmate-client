"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw, Loader2 } from "lucide-react";
import { getAdminBookings, type Booking } from "@/lib/bookings";

const statuses = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const;
function date(value: string) { const n = new Date(value); return Number.isNaN(n.getTime()) ? "—" : n.toLocaleDateString("en-US", { dateStyle: "medium" }); }
function money(value: number | undefined) { return Number.isFinite(value) ? `$${Number(value).toFixed(2)}` : "—"; }

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    getAdminBookings(status).then(data => { if (active) { setItems(data); setError(""); } })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Failed to load bookings"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [status, refresh]);

  function updateFilter(next: (typeof statuses)[number]) { setStatus(next); setLoading(true); }
  function reload() { setLoading(true); setRefresh(n => n+1); }

  return <section className="space-y-7 pb-12">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Admin / Operations</p><h1 className="mt-2 text-3xl font-extrabold">All Repair Bookings</h1><p className="mt-2 text-sm text-muted-foreground">Read-only platform-wide booking history.</p></div><button type="button" onClick={reload} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"><RefreshCw className="size-4"/> Refresh</button></div>
    <div className="flex flex-wrap gap-2" aria-label="Filter booking statuses">{statuses.map(s=><button key={s} type="button" aria-pressed={status===s} onClick={()=>updateFilter(s)} className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize ${status===s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{s.replace("-", " ")}</button>)}</div>
    {loading ? <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-8"><Loader2 className="size-5 animate-spin"/> Loading bookings...</div> : error ? <div role="alert" className="rounded-xl border border-destructive p-6 text-destructive">{error}</div> : items.length===0 ? <div className="rounded-3xl border border-border bg-card p-12 text-center"><ClipboardList className="mx-auto mb-3 size-10 text-primary"/>No bookings match this filter.</div> :
    <div className="overflow-x-auto rounded-3xl border border-border bg-card"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-muted/60"><tr>{["Service", "Customer", "Technician", "Request date", "Preferred date", "Status", "Payment", "Final amount"].map(h=><th className="px-4 py-4" key={h}>{h}</th>)}</tr></thead><tbody>{items.map(b=><tr key={b._id} className="border-t border-border"><td className="px-4 py-4 font-semibold">{b.serviceTitle}</td><td className="px-4 py-4"><div>{b.customerName}</div><div className="break-all text-xs text-muted-foreground">{b.customerEmail}</div></td><td className="px-4 py-4"><div>{b.technicianName}</div><div className="break-all text-xs text-muted-foreground">{b.technicianEmail}</div></td><td className="px-4 py-4">{date(b.createdAt)}</td><td className="px-4 py-4">{date(b.preferredDate)}</td><td className="px-4 py-4 capitalize">{b.status.replace("-", " ")}</td><td className="px-4 py-4 capitalize">{b.paymentStatus}</td><td className="px-4 py-4 font-bold">{money(b.finalAmount)}</td></tr>)}</tbody></table></div>}
    <p className="text-xs text-muted-foreground">Admin access is read-only. Technicians manage repair-status changes from Manage Requests.</p>
  </section>;
}
