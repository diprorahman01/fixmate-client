"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, ClipboardList, CreditCard, Users, ShieldCheck, UserRound, Menu, X, Home, PlusCircle, ArrowLeft, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { getProfile, type FixMateProfile } from "@/lib/profile";

type Role = "customer" | "technician" | "admin";
type Item = { label: string; href: string; icon: typeof Home };
const links: Record<Role, Item[]> = {
  customer: [
    {label:"Overview",href:"/dashboard/customer",icon:LayoutDashboard},
    {label:"My Bookings",href:"/dashboard/customer/bookings",icon:ClipboardList},
    {label:"Payment History",href:"/dashboard/customer/payments",icon:CreditCard},
  ],
  technician: [
    {label:"Overview",href:"/dashboard/technician",icon:LayoutDashboard},
    {label:"Add Service",href:"/dashboard/technician/add-service",icon:PlusCircle},
    {label:"My Services",href:"/dashboard/technician/my-services",icon:Wrench},
    {label:"Manage Requests",href:"/dashboard/technician/requests",icon:ClipboardList},
  ],
  admin: [
    {label:"Overview",href:"/dashboard/admin",icon:LayoutDashboard},
    {label:"Service Approval",href:"/dashboard/admin/services",icon:ShieldCheck},
    {label:"Manage Users",href:"/dashboard/admin/users",icon:Users},
    {label:"All Bookings",href:"/dashboard/admin/bookings",icon:ClipboardList},
    {label:"Transactions",href:"/dashboard/admin/transactions",icon:CreditCard},
  ],
};

export function DashboardShell({role,children}:{role:Role;children:React.ReactNode}) {
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  const router=useRouter();
  const {data:session}=useSession();
  const [profile,setProfile]=useState<FixMateProfile|null>(null);
  const user=session?.user;
  useEffect(()=>{
    if(!user?.id)return;
    let active=true;
    const refresh=()=>{void getProfile().then(p=>{if(active)setProfile(p);}).catch(()=>{});};
    refresh();
    window.addEventListener("fixmate:profile-updated",refresh);
    return ()=>{active=false;window.removeEventListener("fixmate:profile-updated",refresh);};
  },[user?.id]);
  async function logout(){await signOut();router.replace("/");router.refresh();}
  const items:Item[]=[...links[role],{label:"Update Profile",href:"/dashboard/profile",icon:UserRound}];
  const name=profile?.name??user?.name??"My Account";
  const photo=profile?.image??user?.image;
  const account=<span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">{photo? /* eslint-disable-next-line @next/next/no-img-element */ <img src={photo} alt="" className="size-full object-cover"/>:<UserRound className="size-5"/>}</span>;
  const navigation=<nav aria-label={`${role} dashboard navigation`} className="space-y-1 px-3 py-4">{items.map(({href,label,icon:Icon})=>{const selected=pathname===href||(href!==`/dashboard/${role}`&&pathname.startsWith(`${href}/`));return <Link key={href} href={href} aria-current={selected?"page":undefined} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${selected?"bg-primary text-primary-foreground":"text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-5"/>{label}</Link>;})}</nav>;
  return <div className="min-h-screen bg-muted/30 lg:flex">
    {open&&<button type="button" onClick={()=>setOpen(false)} aria-label="Close dashboard navigation" className="fixed inset-0 z-40 bg-black/60 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-5"><Link href="/" className="text-xl font-black text-primary">FixMate <span className="text-xs font-medium text-muted-foreground">Workspace</span></Link><button type="button" className="rounded-lg p-2 lg:hidden" aria-label="Close menu" onClick={()=>setOpen(false)}><X className="size-5"/></button></div>
      <div className="overflow-y-auto"><p className="px-7 pt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">{role} menu</p>{navigation}</div>
      <div className="mt-auto space-y-1 border-t border-border p-4"><Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-muted"><ArrowLeft className="size-4"/> Back to website</Link><button type="button" onClick={()=>void logout()} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-muted"><LogOut className="size-4"/> Sign Out</button></div>
    </aside>
    <div className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex min-h-18 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button type="button" onClick={()=>setOpen(true)} aria-label="Open dashboard navigation" className="rounded-xl border border-border p-2 lg:hidden"><Menu className="size-5"/></button><span className="font-bold capitalize">{role} Dashboard</span></div><div className="flex items-center gap-3"><ThemeToggle/><Link href="/dashboard/profile" aria-label="Update profile" className="flex max-w-44 items-center gap-2 rounded-xl border border-border px-2 py-1.5 hover:bg-muted">{account}<span className="hidden truncate text-sm font-semibold sm:block">{name}</span></Link></div></header><main className="mx-auto w-full max-w-7xl p-4 sm:p-8">{children}</main></div>
  </div>;
}
