"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, CheckCircle2, LoaderCircle, CreditCard } from "lucide-react";
import { beginProCheckout, getProStatus, manageProBilling, type ProStatus } from "@/lib/pro";

export default function TechnicianProPage() {
  const [data, setData] = useState<ProStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setError("");
    try { setData(await getProStatus()); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load plan"); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "success") {
      setNotice("Stripe Checkout returned successfully. Your Pro badge will appear after Stripe confirms billing.");
    }
    void refresh();
  }, []);

  async function visitBilling(action: "subscribe" | "manage") {
    setBusy(true); setError("");
    try {
      const url = action === "subscribe" ? await beginProCheckout() : await manageProBilling();
      if (!url.startsWith("https://checkout.stripe.com/") && !url.startsWith("https://billing.stripe.com/")) throw new Error("Unexpected Stripe URL");
      window.location.assign(url);
    } catch (err) { setError(err instanceof Error ? err.message : "Stripe is unavailable"); setBusy(false); }
  }

  return <main className="mx-auto max-w-4xl space-y-7 py-6">
    <div><p className="font-semibold text-primary">Technician membership</p><h1 className="mt-2 text-3xl font-black">FixMate Verified Pro</h1><p className="mt-2 text-muted-foreground">Upgrade from 3 service listings to unlimited listings. Your Verified Pro badge is displayed only while your paid subscription is active.</p></div>
    <div className="grid gap-5 md:grid-cols-2">
      <article className="rounded-3xl border border-border bg-card p-7"><ShieldCheck className="mb-5 size-9 text-muted-foreground"/><h2 className="text-2xl font-bold">Free</h2><p className="mt-3 text-muted-foreground">3 repair service listings maximum</p><p className="mt-3 text-sm">Service approvals and booking features remain available.</p></article>
      <article className="rounded-3xl border border-primary/50 bg-card p-7 shadow-[0_0_35px_rgba(163,255,52,0.08)]"><Sparkles className="mb-5 size-9 text-primary"/><h2 className="text-2xl font-bold">Verified Pro</h2><p className="mt-3 text-muted-foreground">Unlimited repair service listings</p><p className="mt-3 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary"/>Verified Pro public badge</p><p className="mt-2 text-sm text-muted-foreground">Price and billing interval are shown on Stripe Checkout.</p></article>
    </div>
    {notice && <p role="status" className="rounded-xl border border-primary/30 p-4 text-sm">{notice}</p>}
    {error && <p role="alert" className="rounded-xl border border-red-500/50 p-4 text-sm text-red-500">{error}</p>}
    <section className="rounded-3xl border border-border bg-card p-6">
      {loading ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin"/>Loading plan...</p> : data && <>
        <p className="font-semibold">Current plan: <span className="text-primary">{data.verifiedPro ? "Verified Pro" : "Free"}</span></p>
        <p className="mt-2 text-sm text-muted-foreground">Your listings: {data.services} / {data.limit ?? "unlimited"}</p>
        <p className="mt-1 text-sm text-muted-foreground">Stripe subscription status: {data.subscriptionStatus}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {!data.verifiedPro && <button type="button" disabled={busy} onClick={() => void visitBilling("subscribe")} className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Opening..." : "Upgrade with Stripe"}</button>}
          {(data.verifiedPro || ["past_due", "unpaid", "incomplete", "canceled"].includes(data.subscriptionStatus)) && <button type="button" disabled={busy} onClick={() => void visitBilling("manage")} className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold"><CreditCard className="size-4"/>Manage Billing</button>}
          <button type="button" onClick={() => void refresh()} className="rounded-xl border border-border px-5 py-3">Refresh Status</button>
        </div>
      </>}
    </section>
    <Link href="/dashboard/technician/my-services" className="inline-block font-semibold text-primary hover:underline">Back to My Services</Link>
  </main>;
}
