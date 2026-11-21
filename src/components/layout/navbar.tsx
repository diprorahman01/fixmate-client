"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { getProfile, type FixMateProfile } from "@/lib/profile";

const links=[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"How It Works",href:"/about"}];
function dashboard(role?: string) { return role==="admin"?"/dashboard/admin":role==="technician"?"/dashboard/technician":"/dashboard/customer"; }

export function Navbar() {
  const pathname=usePathname();
  const router=useRouter();
  const {data:session,isPending}=useSession();
  const [mobile,setMobile]=useState(false);
  const [account,setAccount]=useState(false);
  const [profile,setProfile]=useState<FixMateProfile|null>(null);
  const user=session?.user;
  const role=profile?.role ?? (user?.role as string | undefined);

  useEffect(()=>{
    if(!user?.id) return;
    let active=true;
    const refresh=()=>{ void getProfile().then(p=>{if(active)setProfile(p);}).catch(()=>{}); };
    refresh();
    window.addEventListener("fixmate:profile-updated",refresh);
    return ()=>{active=false;window.removeEventListener("fixmate:profile-updated",refresh);};
  },[user?.id]);

  async function logout(){
    await signOut();
    setAccount(false);setMobile(false);setProfile(null);
    router.push("/");router.refresh();
  }
  function active(href:string){return href==="/"?pathname==="/":pathname.startsWith(href);}
  const name=profile?.name ?? user?.name ?? "My account";
  const photo=profile?.image ?? user?.image;
  const avatar=<span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">{photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={photo} alt="" className="size-full object-cover"/>:<UserRound className="size-4"/>}</span>;

  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
    <div className="fixmate-container flex h-20 items-center justify-between gap-3"><Logo/>
      <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">{links.map(l=><Link key={l.href} href={l.href} aria-current={active(l.href)?"page":undefined} className={`border-b-2 py-2 text-sm font-semibold transition-colors ${active(l.href)?"border-primary text-primary":"border-transparent text-muted-foreground hover:text-primary"}`}>{l.label}</Link>)}</nav>
      <div className="hidden items-center gap-3 md:flex"><ThemeToggle/>{!isPending && user ? <div className="relative"><button type="button" aria-expanded={account} aria-label="Open account menu" onClick={()=>setAccount(!account)} className="inline-flex max-w-52 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold">{avatar}<span className="truncate">{name}</span><ChevronDown className="size-4"/></button>{account&&<div className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border bg-card p-2 shadow-xl"><p className="px-3 py-2 text-xs capitalize text-muted-foreground">{role||"Customer"} account</p><Link onClick={()=>setAccount(false)} href={dashboard(role)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><LayoutDashboard className="size-4"/> Dashboard</Link><Link onClick={()=>setAccount(false)} href="/dashboard/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><Settings className="size-4"/> Update Profile</Link><button onClick={()=>void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-muted"><LogOut className="size-4"/> Sign Out</button></div>}</div> : !isPending ? <><Link href="/sign-in" className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">Sign In</Link><Link href="/sign-up" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Sign Up</Link></> : null}</div>
      <div className="flex items-center gap-2 md:hidden"><ThemeToggle/><button type="button" aria-label={mobile?"Close navigation":"Open navigation"} aria-expanded={mobile} aria-controls="fixmate-mobile-navigation" onClick={()=>setMobile(v=>!v)} className="rounded-xl border border-border p-2">{mobile?<X className="size-5"/>:<Menu className="size-5"/>}</button></div>
    </div>
    {mobile&&<nav id="fixmate-mobile-navigation" aria-label="Mobile navigation" className="space-y-1 border-t border-border bg-background p-4 md:hidden">{links.map(l=><Link key={l.href} href={l.href} onClick={()=>setMobile(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-muted">{l.label}</Link>)}<div className="my-2 border-t border-border"/>{user?<><Link href={dashboard(role)} onClick={()=>setMobile(false)} className="block rounded-xl px-4 py-3 font-semibold">Dashboard</Link><Link href="/dashboard/profile" onClick={()=>setMobile(false)} className="block rounded-xl px-4 py-3 font-semibold">Update Profile</Link><button type="button" onClick={()=>void logout()} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-destructive">Sign Out</button></>:<><Link href="/sign-in" onClick={()=>setMobile(false)} className="block rounded-xl px-4 py-3">Sign In</Link><Link href="/sign-up" onClick={()=>setMobile(false)} className="block rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Sign Up</Link></>}</nav>}
  </header>;
}
