"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { redeemAdminInvitation } from "@/lib/admin-invitations";

export default function ActivateAdminPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function activate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setBusy(true);
    try {
      await redeemAdminInvitation(code);
      toast.success("Admin access activated");
      router.replace("/dashboard/admin"); router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Activation failed");
    } finally { setBusy(false); }
  }
  return <section className="mx-auto max-w-lg px-4 py-16">
    <div className="rounded-3xl border border-border bg-card p-8">
      <ShieldCheck className="mb-4 size-10 text-primary" />
      <h1 className="text-3xl font-extrabold">Activate Admin Invitation</h1>
      <p className="mt-3 text-sm text-muted-foreground">Sign in with the invited Customer account first. This does not create a new account.</p>
      <form onSubmit={(e) => void activate(e)} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Invitation code
          <input required autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 font-mono text-xs" />
        </label>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button disabled={busy} className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Activating..." : "Activate Admin Access"}</button>
      </form>
      <Link href="/sign-in" className="mt-5 inline-block text-sm font-semibold text-primary">Sign in first</Link>
    </div>
  </section>;
}
