"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, Clock3, CreditCard, Loader2, Wrench } from "lucide-react";
import { getMyBookings, type Booking } from "@/lib/bookings";
import { getPaymentHistory, type Payment } from "@/lib/payments";

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getMyBookings(), getPaymentHistory()]).then(([b,p])=>{ if(active){setBookings(b);setPayments(p);} })
      .catch(e=>{ if(active)setError(e instanceof Error?e.message:"Could not load dashboard"); })
      .finally(()=>{ if(active)setLoading(false); });
    return ()=>{active=false;};
  }, []);
  const active = bookings.filter(b=>["requested","accepted","in-progress"].includes(b.status));
  const completed = bookings.filter(b=>b.status === "completed");
  const unpaid = completed.filter(b=>b.paymentStatus === "unpaid");
  const spent = payments.reduce((s,p)=>s+p.amount,0);
  const latest = [...bookings].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,4);
  return <section className="space-y-8 pb-12"><div><p className="text-sm font-semibold text-primary">Customer workspace</p><h1 className="mt-2 text-3xl font-extrabold">My Repair Dashboard</h1><p className="mt-2 text-muted-foreground">Your bookings, repair progress and payments in one place.</p></div>
    {loading?<div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-10"><Loader2 className="size-6 animate-spin text-primary"/> Loading your dashboard...</div>:error?<div className="rounded-2xl border border-destructive p-6 text-destructive" role="alert">{error}</div>:<>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        {label:"Total bookings",value:bookings.length,icon:CalendarCheck},
        {label:"Active repairs",value:active.length,icon:Clock3},
        {label:"Completed",value:completed.length,icon:CheckCircle2},
        {label:"Paid (USD)",value:`$${spent.toFixed(2)}`,icon:CreditCard},
      ].map(s=>{const Icon=s.icon;return <div key={s.label} className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5"/></div><p className="text-sm text-muted-foreground">{s.label}</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{s.value}</p></div>;})}</div>
      {unpaid.length>0&&<Link href="/dashboard/customer/bookings" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5"><span className="font-semibold">{unpaid.length} completed repair(s) awaiting payment</span><span className="flex items-center gap-2 text-sm font-bold text-primary">Pay Now <ArrowRight className="size-4"/></span></Link>}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]"><div className="rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-lg font-bold">Recent Bookings</h2><Link href="/dashboard/customer/bookings" className="text-sm font-semibold text-primary">View All</Link></div>{latest.length===0?<p className="text-muted-foreground">You have not requested a repair yet.</p>:<div className="divide-y divide-border">{latest.map(b=><div key={b._id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="truncate font-semibold">{b.serviceTitle}</p><p className="mt-1 text-xs text-muted-foreground">{b.technicianName}</p></div><span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{b.status.replace("-"," ")}</span></div>)}</div>}</div><div className="rounded-2xl border border-border bg-card p-6"><Wrench className="mb-4 size-9 text-primary"/><h2 className="text-lg font-bold">Need a repair?</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Browse approved services and send your next request.</p><Link href="/services" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Find Services <ArrowRight className="size-4"/></Link></div></div>
    </>}
  </section>;
}
