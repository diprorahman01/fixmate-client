"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

type Role = "customer" | "technician";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  function passwordMessage(value: string): string {
    if (value.length < 6) return "Use at least 6 characters.";
    if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Include at least one lowercase letter.";
    return "";
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setPasswordError("");
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    const message = passwordMessage(password);
    if (message) return setPasswordError(message);
    setBusy(true);
    try {
      const result = await signUp.email({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
      if (result.error) {
        const message = result.error.message || "Registration failed";
        if (/password|uppercase|lowercase|character/i.test(message)) setPasswordError(message);
        else setError(message);
        toast.error(message);
        return;
      }
      toast.success("Account created successfully!");
      router.replace(role === "technician" ? "/dashboard/technician" : "/");
      router.refresh();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Registration failed";
      setError(message); toast.error(message);
    } finally { setBusy(false); }
  }

  return (
    <section className="fixmate-auth-background flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <Wrench className="mx-auto mb-4 size-12 text-primary" />
          <h1 className="text-3xl font-extrabold">Join FixMate</h1>
          <p className="mt-3 text-sm text-muted-foreground">Create an account to start your repair journey.</p>
        </div>
        <form onSubmit={(event) => void submit(event)} className="space-y-5" noValidate>
          <label className="block text-sm font-semibold">Full Name
            <input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
          </label>
          <label className="block text-sm font-semibold">Email Address
            <input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4" />
          </label>
          <label className="block text-sm font-semibold">Password
            <span className="relative mt-2 block">
              <input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} aria-invalid={Boolean(passwordError)} aria-describedby="signup-password-help signup-password-error" onChange={e=>{ setPassword(e.target.value); if (passwordError) setPasswordError(passwordMessage(e.target.value)); }} placeholder="Create a password" className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12" />
              <button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword?<EyeOff className="size-5"/>:<Eye className="size-5"/>}</button>
            </span>
            <span id="signup-password-help" className="mt-2 block text-xs font-normal text-muted-foreground">At least 6 characters, one uppercase and one lowercase letter.</span>
            {passwordError && <span id="signup-password-error" role="alert" className="mt-2 block text-sm font-medium text-red-500">{passwordError}</span>}
          </label>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Register As</legend>
            <div className="grid grid-cols-2 gap-3">
              {(["customer","technician"] as const).map(r => <button key={r} type="button" aria-pressed={role===r} onClick={()=>setRole(r)} className={`flex flex-col items-center gap-2 rounded-2xl border p-5 ${role===r?"border-primary bg-primary/10":"border-border"}`}>
                {r==="customer"?<UserRound className="size-6 text-primary"/>:<Wrench className="size-6 text-primary"/>}
                <span className="font-semibold capitalize">{r}</span>
                <span className="text-xs text-muted-foreground">{r==="customer"?"Book repairs":"Offer services"}</span>
              </button>)}
            </div>
          </fieldset>
          {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">{busy?"Creating account...":"Create Account"}<ArrowRight className="size-4"/></button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border"/>or<div className="h-px flex-1 bg-border"/></div>
        <GoogleSignInButton />
        <p className="mt-6 text-center text-sm text-muted-foreground">Google accounts start as Customers. <Link href="/sign-in" className="font-semibold text-primary">Sign In</Link></p>
      </div>
    </section>
  );
}
