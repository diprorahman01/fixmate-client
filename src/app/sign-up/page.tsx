"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

type Role = "customer" | "technician";

export default function SignUpPage() {
  const router = useRouter();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState<Role>("customer");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const passwordValid = password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setError("");
    if (!name.trim()) {setError("Please enter your full name");return;}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {setError("Enter a valid email address");return;}
    if (!passwordValid) {setError("Use at least 6 characters, one uppercase and one lowercase letter");return;}
    setLoading(true);
    try {
      const result = await signUp.email({name:name.trim(),email:email.trim().toLowerCase(),password,role});
      if(result.error){const msg=result.error.message || "Registration failed";setError(msg);toast.error(msg);return;}
      toast.success("Account created successfully!");
      router.replace(role === "technician" ? "/dashboard/technician" : "/");
      router.refresh();
    } catch (reason) { const msg=reason instanceof Error ? reason.message : "Registration failed";setError(msg);toast.error(msg); }
    finally {setLoading(false);}
  }
  return <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-muted/30 px-4 py-16">
    <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
      <div className="mb-7 text-center"><div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Wrench className="size-7"/></div><h1 className="text-3xl font-extrabold">Join FixMate</h1><p className="mt-3 text-sm text-muted-foreground">Create an account to start your repair journey.</p></div>
      <form onSubmit={(e)=>void submit(e)} className="space-y-5">
        <label className="block text-sm font-semibold">Full Name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="Enter your full name"/></label>
        <label className="block text-sm font-semibold">Email Address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="you@example.com"/></label>
        <label className="block text-sm font-semibold">Password<span className="relative mt-2 block"><input required type={showPassword?"text":"password"} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 outline-none focus:border-primary" placeholder="Create a password"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"} className="absolute right-4 top-1/2 -translate-y-1/2"><span className="text-muted-foreground">{showPassword?<EyeOff className="size-5"/>:<Eye className="size-5"/>}</span></button></span><span className="mt-2 block text-xs font-normal text-muted-foreground">At least 6 characters, one uppercase and one lowercase letter.</span></label>
        <fieldset><legend className="mb-3 text-sm font-semibold">Register As</legend><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{(["customer","technician"] as const).map(r=><button key={r} type="button" aria-pressed={role===r} onClick={()=>setRole(r)} className={`flex flex-col items-center gap-2 rounded-2xl border p-5 ${role===r?"border-primary bg-primary/10":"border-border"}`}>{r==="customer"?<UserRound className="size-6 text-primary"/>:<Wrench className="size-6 text-primary"/>}<span className="font-semibold capitalize">{r}</span><span className="text-xs text-muted-foreground">{r==="customer"?"Book repairs":"Offer services"}</span></button>)}<Link href="/sign-up/admin" className="flex flex-col items-center gap-2 rounded-2xl border border-border p-5 text-center transition-colors hover:border-primary hover:bg-primary/10"><ShieldCheck className="size-6 text-primary"/><span className="font-semibold">Admin</span><span className="text-xs text-muted-foreground">Admin access requires approval</span></Link></div></fieldset>
        {error&&<p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50">{loading?"Creating account...":"Create Account"}<ArrowRight className="size-4"/></button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="font-semibold text-primary">Sign In</Link> <span className="mx-1">·</span> <Link href="/sign-in/admin" className="font-semibold text-primary">Admin Sign In</Link></p>
      <p className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4"/> Secure account registration</p>
    </div>
  </section>;
}
