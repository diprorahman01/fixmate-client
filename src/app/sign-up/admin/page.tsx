"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export default function AdminSignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!name.trim()) return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return setError("Password needs 6+ characters, an uppercase and a lowercase letter.");
    }
    setBusy(true);
    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "admin",
      });
      if (result.error) throw new Error(result.error.message || "Admin registration failed.");
      toast.success("Admin account created successfully!");
      router.replace("/dashboard/admin");
      router.refresh();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Admin registration failed.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-muted/30 px-4 py-16">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <ShieldCheck className="mx-auto mb-4 size-12 text-primary" />
          <h1 className="text-3xl font-extrabold">Sign Up as Admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">Use your name, email and password to create an Admin account for the local FixMate demonstration.</p>
        </div>
        <form onSubmit={(event) => void submit(event)} className="space-y-5">
          <label className="block text-sm font-semibold">Full Name
            <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
          </label>
          <label className="block text-sm font-semibold">Email Address
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
          </label>
          <label className="block text-sm font-semibold">Password
            <span className="relative mt-2 block">
              <input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>
            </span>
            <span className="mt-2 block text-xs font-normal text-muted-foreground">At least 6 characters, one uppercase and one lowercase letter.</span>
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Creating Admin account..." : "Create Admin Account"}<ArrowRight className="size-5" />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link href="/sign-in" className="font-semibold text-primary">Sign In</Link></p>
        <p className="mt-3 text-center text-sm"><Link href="/sign-up" className="text-muted-foreground hover:text-primary">Other registration options</Link></p>
        <p className="mt-5 border-t border-border pt-4 text-center text-xs text-muted-foreground">Admin self-registration is available in local development only.</p>
      </div>
    </section>
  );
}
