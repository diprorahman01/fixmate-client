"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

// Admin registration requests begin as normal Customer accounts.
// Only an already-authorized Admin can grant the Admin role
// through the server-protected Manage Users page.
export default function AdminSignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!name.trim()) { setError("Please enter your full name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address"); return;
    }
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password needs at least 6 characters, uppercase and lowercase letters"); return;
    }
    setBusy(true);
    try {
      // Never send role: "admin" in public registration.
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "customer",
      });
      if (result.error) {
        throw new Error(result.error.message || "Registration failed");
      }
      setCreated(true);
      toast.success("Account created. Admin approval is required.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <ShieldCheck className="mx-auto mb-4 size-12 text-primary" />
          <h1 className="text-3xl font-extrabold">Sign Up as Admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Register with your name, email and password. An existing FixMate Admin must approve your Admin access.
          </p>
        </div>
        {created ? (
          <div role="status" className="space-y-4 rounded-2xl border border-primary/40 bg-primary/5 p-5 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h2 className="text-xl font-bold">Account created!</h2>
            <p className="text-sm text-muted-foreground">
              Your account is registered with Customer access for now. Ask an existing Admin to open
              Manage Users and change your role to Admin. Do not register again.
            </p>
            <Link href="/sign-in/admin" className="inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
              Go to Admin Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5">
            <label className="block text-sm font-semibold">Full Name
              <input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Your full name" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
            </label>
            <label className="block text-sm font-semibold">Email Address
              <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
            </label>
            <label className="block text-sm font-semibold">Password
              <input required type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} minLength={6} placeholder="At least 6 characters" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
              <span className="mt-2 block text-xs font-normal text-muted-foreground">At least 6 characters, one uppercase and one lowercase letter.</span>
            </label>
            {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">
              <UserPlus className="size-5" />{busy ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/sign-in/admin" className="font-semibold text-primary">Admin Sign In</Link>
          <Link href="/sign-up" className="text-muted-foreground hover:text-primary">Other registration options</Link>
        </div>
      </div>
    </section>
  );
}
