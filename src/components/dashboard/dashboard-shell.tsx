"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wrench, ClipboardList, CreditCard, Users, ShieldCheck, UserRound, Menu, X, Home, PlusCircle, Settings, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

type Role = "customer" | "technician" | "admin";
type Item = { label: string; href: string; icon: typeof Home };
const links: Record<Role, Item[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: ClipboardList },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: ShieldCheck },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items: Item[] = [...links[role], { label: "Update Profile", href: "/dashboard/profile", icon: UserRound }];
  const Nav = () => (
    <nav aria-label={`${role} dashboard navigation`} className="space-y-1 p-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== `/dashboard/${role}` && pathname.startsWith(`${href}/`));
        return <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <Icon className="size-5"/> {label}
        </Link>;
      })}
    </nav>
  );
  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      {open && <button type="button" aria-label="Close dashboard navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden"/>}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight text-primary">FixMate<span className="ml-2 text-xs font-medium text-muted-foreground">Workspace</span></Link>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-lg p-2 lg:hidden"><X className="size-5"/></button>
        </div>
        <div className="overflow-y-auto"><p className="px-7 pb-1 pt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">{role} menu</p><Nav/></div>
        <div className="mt-auto border-t border-border p-4"><Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-muted"><ArrowLeft className="size-4"/> Back to Website</Link></div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3"><button aria-label="Open dashboard navigation" type="button" onClick={() => setOpen(true)} className="rounded-xl border border-border p-2 lg:hidden"><Menu className="size-5"/></button><span className="font-bold capitalize">{role} Dashboard</span></div>
          <div className="flex items-center gap-3"><ThemeToggle/><Link href="/dashboard/profile" aria-label="Update profile" className="rounded-xl border border-border p-2 hover:bg-muted"><Settings className="size-5"/></Link></div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
