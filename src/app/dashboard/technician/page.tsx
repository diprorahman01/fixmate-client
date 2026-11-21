"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ClipboardList, Loader2, PlusCircle, Wrench } from "lucide-react";
import { getMyServices } from "@/lib/technician-services";
import { getTechnicianRequests, type Booking } from "@/lib/bookings";
import type { RepairService } from "@/lib/services";

export default function TechnicianOverviewPage() {
  const [services,setServices]=useState<RepairService[]>([]);
  const [requests,setRequests]=useState<Booking[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    Promise.all([getMyServices(),getTechnicianRequests()]).then(([s,b])=>{if(active){setServices(s);setRequests(b);}})
      .catch(e=>{if(active)setError(e instanceof Error?e.message:"Failed to load dashboard");})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  const pending=services.filter(s=>s.approvalStatus==="pending").length;
  const waiting=requests.filter(r=>r.status==="requested").length;
  const inProgress=requests.filter(r=>r.status==="in-progress").length;
  const completed=requests.filter(r=>r.status==="completed").length;
  const recent=[...requests].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5);
  return <section className="space-y-8 pb-12"><div><p className="text-sm font-semibold text-primary">Technician workspace</p><h1 className="mt-2 text-3xl font-extrabold">Technician Dashboard</h1><p className="mt-2 text-muted-foreground">Manage your services and repair requests.</p></div>
    {loading?<div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-10"><Loader2 className="size-6 animate-spin text-primary"/> Loading dashboard...</div>:error?<div role="alert" className="rounded-2xl border border-destructive p-6 text-destructive">{error}</div>:<>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      {label:"My services",value:services.length,icon:Wrench},
      {label:"Pending approval",value:pending,icon:Clock3},
      {label:"New requests",value:waiting,icon:ClipboardList},
      {label:"Completed repairs",value:completed,icon:CheckCircle2},
    ].map(s=>{const Icon=s.icon;return <div key={s.label} className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5"/></div><p className="text-sm text-muted-foreground">{s.label}</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{s.value}</p></div>;})}</div>
    <div className="flex flex-wrap gap-3"><Link href="/dashboard/technician/add-service" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><PlusCircle className="size-4"/> Add Service</Link><Link href="/dashboard/technician/requests" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold">Manage Requests <ArrowRight className="size-4"/></Link></div>
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]"><div className="rounded-2xl border border-border bg-card p-6"><h2 className="mb-4 text-lg font-bold">Recent Repair Requests</h2>{recent.length===0?<p className="text-sm text-muted-foreground">No repair requests yet.</p>:<div className="divide-y divide-border">{recent.map(r=><div key={r._id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="truncate font-semibold">{r.serviceTitle}</p><p className="text-xs text-muted-foreground">{r.customerName} · {r.preferredDate.slice(0,10)}</p></div><span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{r.status.replace("-"," ")}</span></div>)}</div>}</div><div className="rounded-2xl border border-border bg-card p-6"><h2 className="text-lg font-bold">Job snapshot</h2><p className="mt-4 text-3xl font-extrabold text-primary">{inProgress}</p><p className="text-sm text-muted-foreground">Repairs currently in progress</p><p className="mt-6 text-3xl font-extrabold text-primary">{services.filter(s=>s.approvalStatus==="approved"&&s.isAvailable).length}</p><p className="text-sm text-muted-foreground">Approved and available services</p></div></div>
    </>}
  </section>;
}
