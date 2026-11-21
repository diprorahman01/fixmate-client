
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  CreditCard,
  Users,
  ShieldCheck,
  UserRound,
  Menu,
  X,
  Home,
  PlusCircle,
  ArrowLeft,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { getProfile, type FixMateProfile } from "@/lib/profile";

type Role = "customer" | "technician" | "admin";

type Item = {
  label: string;
  href: string;
  icon: typeof Home;
};

const links: Record<Role, Item[]> = {
  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardList,
    },
    {
      label: "Payment History",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],
  technician: [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Manage Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Service Approval",
      href: "/dashboard/admin/services",
      icon: ShieldCheck,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "All Bookings",
      href: "/dashboard/admin/bookings",
      icon: ClipboardList,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<FixMateProfile | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  const dashboardHome = `/dashboard/${role}`;

  // Load latest profile information.
  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    const refresh = () => {
      void getProfile()
        .then((data) => {
          if (active) setProfile(data);
        })
        .catch(() => {});
    };

    refresh();

    window.addEventListener("fixmate:profile-updated", refresh);

    return () => {
      active = false;
      window.removeEventListener("fixmate:profile-updated", refresh);
    };
  }, [user?.id]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function logout() {
    if (signingOut) return;

    setSigningOut(true);
    setProfileOpen(false);

    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const name = profile?.name ?? user?.name ?? "My Account";
  const email = user?.email ?? "";
  const photo = profile?.image ?? user?.image;

  const items: Item[] = [
    ...links[role],
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  const accountAvatar = (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <UserRound className="size-5" />
      )}
    </span>
  );

  const navigation = (
    <nav
      aria-label={`${role} dashboard navigation`}
      className="space-y-1 px-3 py-4"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const selected =
          pathname === href ||
          (href !== dashboardHome &&
            pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            aria-current={selected ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              selected
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close dashboard navigation"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <Link
            href="/"
            className="text-xl font-black text-primary"
          >
            FixMate{" "}
            <span className="text-xs font-medium text-muted-foreground">
              Workspace
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <p className="px-7 pt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {role} menu
          </p>

          {navigation}
        </div>

        <div className="mt-auto space-y-1 border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </Link>

          <button
            type="button"
            onClick={() => void logout()}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-muted disabled:opacity-50"
          >
            <LogOut className="size-4" />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main dashboard */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-18 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open dashboard navigation"
              className="rounded-xl border border-border p-2 lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <span className="font-bold capitalize">
              {role} Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-controls="fixmate-profile-menu"
                className="flex max-w-52 items-center gap-2 rounded-xl border border-border px-2 py-1.5 transition-colors hover:bg-muted"
              >
                {accountAvatar}

                <span className="hidden truncate text-sm font-semibold sm:block">
                  {name}
                </span>

                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  id="fixmate-profile-menu"
                  className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl"
                >
                  <div className="border-b border-border px-3 py-3">
                    <p className="truncate font-bold">{name}</p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                      {role}
                    </span>
                  </div>

                  <div className="space-y-1 py-2">
                    <Link
                      href={dashboardHome}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      My Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
                    >
                      <UserRound className="size-4" />
                      Update Profile
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
                    >
                      <Home className="size-4" />
                      Back to Website
                    </Link>
                  </div>

                  <div className="border-t border-border pt-2">
                    <button
                      type="button"
                      onClick={() => void logout()}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-destructive hover:bg-muted disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {signingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
