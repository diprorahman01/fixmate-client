"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile, uploadProfileImage, type FixMateProfile } from "@/lib/profile";

export default function UpdateProfilePage() {
  const [profile, setProfile] = useState<FixMateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    getProfile().then((data) => { if (active) setProfile(data); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load profile"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function chooseImage(file?: File) {
    if (!file || !profile) return;
    setUploading(true);
    try {
      const result = await uploadProfileImage(file);
      setProfile((current) => current ? { ...current, image: result.url } : current);
      toast.success("Photo uploaded. Click Save Changes to update your profile.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || saving || uploading) return;
    setSaving(true);
    try {
      const result = await updateProfile({
        name: profile.name, phone: profile.phone, area: profile.area,
        bio: profile.bio, image: profile.image,
      });
      setProfile(result.profile);
      window.dispatchEvent(new Event("fixmate:profile-updated"));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-20 rounded-2xl bg-muted"/><div className="h-96 rounded-2xl bg-muted"/></div>;
  if (error || !profile) return <div role="alert" className="rounded-2xl border border-destructive p-6">{error || "Profile unavailable"}</div>;
  const change = (field: "name" | "phone" | "area" | "bio", value: string) => setProfile((current) => current ? { ...current, [field]: value } : current);

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div><p className="text-sm font-semibold text-primary">Account settings</p><h1 className="mt-1 text-3xl font-extrabold">Update Profile</h1><p className="mt-2 text-muted-foreground">Change your personal information and profile photo.</p></div>
      <form onSubmit={(event) => void save(event)} className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-5 border-b border-border pb-7">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-primary/10 text-primary">
            {profile.image ? <img src={profile.image} alt="Profile" className="size-full object-cover"/> : <UserRound className="size-12"/>}
          </div>
          <div>
            <p className="font-semibold">Profile photo</p>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB</p>
            <input ref={fileInput} aria-label="Choose profile photo" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => void chooseImage(e.target.files?.[0])}/>
            <button type="button" disabled={uploading || saving} onClick={() => fileInput.current?.click()} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-50">
              {uploading ? <Loader2 className="size-4 animate-spin"/> : <Camera className="size-4"/>} {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold">Full Name<input required minLength={2} maxLength={80} value={profile.name} onChange={(e) => change("name",e.target.value)} className="w-full rounded-xl border border-input bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-ring"/></label>
          <label className="space-y-2 text-sm font-semibold">Email (read only)<input readOnly value={profile.email} className="w-full rounded-xl border border-input bg-muted p-3 font-normal text-muted-foreground"/></label>
          <label className="space-y-2 text-sm font-semibold">Phone<input maxLength={25} value={profile.phone} onChange={(e) => change("phone",e.target.value)} placeholder="01712345678" className="w-full rounded-xl border border-input bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-ring"/></label>
          <label className="space-y-2 text-sm font-semibold">Area<input maxLength={100} value={profile.area} onChange={(e) => change("area",e.target.value)} placeholder="Dhaka" className="w-full rounded-xl border border-input bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-ring"/></label>
          <label className="space-y-2 text-sm font-semibold sm:col-span-2">About You<textarea rows={4} maxLength={500} value={profile.bio} onChange={(e) => change("bio",e.target.value)} className="w-full rounded-xl border border-input bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-ring"/><span className="block text-right text-xs text-muted-foreground">{profile.bio.length}/500</span></label>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"><p className="inline-flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4"/> Role: {profile.role} (managed by admin)</p><button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50">{saving ? <Loader2 className="size-4 animate-spin"/> : <Save className="size-4"/>} {saving ? "Saving..." : "Save Changes"}</button></div>
      </form>
    </section>
  );
}
