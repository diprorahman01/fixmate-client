"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getProfile, type FixMateProfile } from "@/lib/profile";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FixMateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((x) => x + 1), []);
  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => { if (active) { setProfile(data); setError(""); } })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load profile");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  if (loading) return <div className="mx-auto max-w-xl p-10 text-center">Loading profile...</div>;
  if (error || !profile) return (
    <section className="mx-auto max-w-xl space-y-4 p-10 text-center" role="alert">
      <h1 className="text-xl font-bold">Could not load your profile</h1>
      <p className="text-destructive">{error || "Profile unavailable"}</p>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={() => { setLoading(true); reload(); }} className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground">Try Again</button>
        <Link href="/sign-in?callbackURL=%2Fdashboard%2Fprofile" className="rounded-xl border border-border px-5 py-2">Sign In</Link>
      </div>
    </section>
  );
  return <DashboardShell role={profile.role}>{children}</DashboardShell>;
}
