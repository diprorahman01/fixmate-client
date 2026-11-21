"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getProfile, type FixMateProfile } from "@/lib/profile";
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FixMateProfile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getProfile().then(p => { if(active) setProfile(p); }).catch(() => {if(active) setError("Please sign in to view your profile.");});
    return () => { active = false; };
  }, []);
  if (error) return <div className="p-12 text-center" role="alert">{error} <Link className="text-primary underline" href="/sign-in">Sign In</Link></div>;
  if (!profile) return <div className="p-12 text-center">Loading profile...</div>;
  return <DashboardShell role={profile.role}>{children}</DashboardShell>;
}
