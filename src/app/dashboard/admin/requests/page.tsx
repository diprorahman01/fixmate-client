"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { getAdminRequests, decideAdminRequest, type AdminAccessRequest } from "@/lib/admin-requests";

export default function AdminRequestsPage() {
  const [items,setItems]=useState<AdminAccessRequest[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState<string | null>(null);
  const [error,setError]=useState("");
  const reload=useCallback(async()=>{
    setLoading(true);setError("");
    try { setItems(await getAdminRequests()); }
    catch(e){setError(e instanceof Error ? e.message : "Unable to load requests");}
    finally {setLoading(false);}
  },[]);
  useEffect(()=>{void reload();},[reload]);
  async function decide(item:AdminAccessRequest,decision:"approve"|"reject") {
    if(!window.confirm(`${decision === "approve" ? "Approve" : "Reject"} Admin access for ${item.email}?`))return;
    setBusy(item._id);
    try { const result=await decideAdminRequest(item._id,decision);toast.success(result.message);await reload(); }
    catch(e){toast.error(e instanceof Error ? e.message : "Unable to update request");}
    finally{setBusy(null);}
  }
  return <section className="space-y-6 pb-12">
    <div className="flex flex-wrap items-center justify-between gap-3"><div>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="size-4"/> Administrator Workspace</span>
      <h1 className="mt-2 text-3xl font-extrabold">Admin Access Requests</h1>
      <p className="mt-2 text-muted-foreground">Approve or reject requests from registered accounts.</p>
    </div><button type="button" onClick={()=>void reload()} className="inline-flex gap-2 rounded-xl border border-border px-4 py-2"><RefreshCw className="size-4"/>Refresh</button></div>
    {loading ? <p>Loading requests...</p> : error ? <p role="alert" className="text-red-500">{error}</p> : items.length === 0 ? <div className="rounded-2xl border border-border bg-card p-8">No pending Admin requests.</div> :
    <div className="space-y-3">{items.map(item=><article key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div><h2 className="font-bold">{item.name}</h2><p className="text-sm text-muted-foreground">{item.email}</p><p className="text-xs text-muted-foreground">Requested: {new Date(item.createdAt).toLocaleString()}</p></div>
      <div className="flex gap-2"><button disabled={busy!==null} onClick={()=>void decide(item,"approve")} className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50">Approve</button><button disabled={busy!==null} onClick={()=>void decide(item,"reject")} className="rounded-xl border border-border px-4 py-2 font-semibold disabled:opacity-50">Reject</button></div>
    </article>)}</div>}
    <Link className="inline-flex font-semibold text-primary" href="/dashboard/admin">Back to Admin Dashboard</Link>
  </section>;
}
