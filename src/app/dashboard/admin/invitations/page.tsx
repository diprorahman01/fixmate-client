"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Copy, UserPlus } from "lucide-react";
import { createAdminInvitation, type AdminInvitation } from "@/lib/admin-invitations";

export default function AdminInvitationsPage() {
  const [email, setEmail] = useState("");
  const [invitation, setInvitation] = useState<AdminInvitation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setInvitation(null); setBusy(true); setCopied(false);
    try { setInvitation(await createAdminInvitation(email)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to issue invitation"); }
    finally { setBusy(false); }
  }
  return <section className="max-w-3xl space-y-7 pb-14">
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="size-5" /> Restricted Admin Management</p>
      <h1 className="text-3xl font-extrabold">Invite an Administrator</h1>
      <p className="mt-3 text-muted-foreground">Only Admins can issue a one-use invitation. Each code is tied to one email and expires in 24 hours.</p>
    </div>
    <div className="rounded-3xl border border-border bg-card p-7">
      <form onSubmit={(e) => void submit(e)} className="space-y-4">
        <label className="block text-sm font-semibold">New Admin Email Address
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="newadmin@example.com" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
        </label>
        <button disabled={busy} className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60"><UserPlus className="size-5" /> {busy ? "Creating..." : "Create Invitation"}</button>
      </form>
      {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}
      {invitation && <div className="mt-6 space-y-3 rounded-2xl border border-primary/40 bg-primary/5 p-5">
        <h2 className="font-bold">Invitation created — copy now</h2>
        <p className="text-sm">For: <strong>{invitation.email}</strong></p>
        <p className="text-sm text-muted-foreground">Expires: {new Date(invitation.expiresAt).toLocaleString()}. This code is not shown again.</p>
        <p className="break-all rounded-xl border border-border bg-background p-3 font-mono text-xs">{invitation.code}</p>
        <button type="button" onClick={() => { void navigator.clipboard.writeText(invitation.code).then(() => setCopied(true)).catch(() => setError("Copy failed. Select the code manually.")); }} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold"><Copy className="size-4" /> {copied ? "Copied" : "Copy Code"}</button>
        <p className="text-sm text-muted-foreground">Send the code privately to the invited person. They can register at <Link href="/sign-up/admin" className="font-semibold text-primary">Sign Up as Admin</Link> or activate an existing Customer account.</p>
      </div>}
    </div>
  </section>;
}
