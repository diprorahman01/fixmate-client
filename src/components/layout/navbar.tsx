"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { getProfile, type FixMateProfile } from "@/lib/profile";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
];

type Role = "customer" | "technician" | "admin";

function normalizeRole(value?: string | null): Role {
  if (value === "admin" || value === "technician") return value;
  return "customer";
}

function dashboard(role: Role) {
  return `/dashboard/${role}`;
}

function RoleBadge({ role }: { role: Role }) {
  const style = {
    admin: "border-violet-500/35 bg-violet-500/10 text-violet-600 dark:text-violet-300",
    technician: "border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    customer: "border-primary/35 bg-primary/10 text-primary",
  }[role];

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${style}`}>
      {role}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobile, setMobile] = useState(false);
  const [account, setAccount] = useState(false);
  const [profile, setProfile] = useState<FixMateProfile | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const user = session?.user;
  const role = normalizeRole(profile?.role ?? (user?.role as string | undefined));

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    const refresh = () => {
      void getProfile()
        .then((p) => { if (active) setProfile(p); })
        .catch(() => {});
    };
    refresh();
    window.addEventListener("fixmate:profile-updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("fixmate:profile-updated", refresh);
    };
  }, [user?.id]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccount(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setAccount(false); setMobile(false); }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function logout() {
    await signOut();
    setAccount(false);
    setMobile(false);
    setProfile(null);
    router.push("/");
    router.refresh();
  }

  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const name = profile?.name ?? user?.name ?? "My account";
  const photo = profile?.image ?? user?.image;
  const avatar = (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="size-full object-cover" />
      ) : (
        <UserRound className="size-4" />
      )}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="fixmate-container flex h-20 items-center justify-between gap-3">
        <Logo />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}
              className={`border-b-2 py-2 text-sm font-semibold transition-colors ${active(link.href) ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!isPending && user ? (
            <div className="relative" ref={accountRef}>
              <button type="button" aria-expanded={account} aria-haspopup="true" aria-controls="fixmate-account-menu"
                onClick={() => setAccount((value) => !value)}
                className="inline-flex max-w-52 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:border-primary/40">
                {avatar}
                <span className="truncate">{name}</span>
                <ChevronDown className={`size-4 transition-transform ${account ? "rotate-180" : ""}`} />
              </button>
              {account && (
                <div id="fixmate-account-menu" className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
                  <div className="space-y-2 border-b border-border px-3 py-3">
                    <p className="truncate text-sm font-bold">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <RoleBadge role={role} />
                  </div>
                  <Link onClick={() => setAccount(false)} href={dashboard(role)} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <Link onClick={() => setAccount(false)} href="/dashboard/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                    <Settings className="size-4" /> Update Profile
                  </Link>
                  <button type="button" onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-muted">
                    <LogOut className="size-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : !isPending ? (
            <>
              <Link href="/sign-in" className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">Sign In</Link>
              <Link href="/sign-up" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Sign Up</Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button type="button" aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile} aria-controls="fixmate-mobile-navigation"
            onClick={() => setMobile((value) => !value)} className="rounded-xl border border-border p-2">
            {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav id="fixmate-mobile-navigation" aria-label="Mobile navigation" className="space-y-1 border-t border-border bg-background p-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobile(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold ${active(link.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3">{avatar}<div className="min-w-0"><p className="truncate text-sm font-bold">{name}</p><RoleBadge role={role} /></div></div>
              <Link href={dashboard(role)} onClick={() => setMobile(false)} className="block rounded-xl px-4 py-3 font-semibold">Dashboard</Link>
              <Link href="/dashboard/profile" onClick={() => setMobile(false)} className="block rounded-xl px-4 py-3 font-semibold">Update Profile</Link>
              <button type="button" onClick={() => void logout()} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-destructive">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setMobile(false)} className="block rounded-xl px-4 py-3">Sign In</Link>
              <Link href="/sign-up" onClick={() => setMobile(false)} className="block rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
