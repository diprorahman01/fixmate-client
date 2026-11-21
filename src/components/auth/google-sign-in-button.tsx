"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

/** Uses Better Auth's OAuth flow. The server decides role, not the browser. */
export function GoogleSignInButton({ callbackURL }: { callbackURL?: string }) {
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const next = callbackURL ? `?next=${encodeURIComponent(callbackURL)}` : "";
      const result = await signIn.social({
        provider: "google",
        callbackURL: `/auth/continue${next}`,
        errorCallbackURL: "/sign-in?error=google",
      });
      if (result.error) throw new Error(result.error.message || "Google sign-in failed");
      // Better Auth redirects the browser to Google.
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
      setLoading(false);
    }
  }
  return <button type="button" onClick={()=>void handleClick()} disabled={loading} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background font-semibold transition hover:bg-muted disabled:opacity-60">
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.83 7.18l7.73 6C44.35 38.03 46.98 31.87 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59A14.45 14.45 0 0 1 9.75 24c0-1.6.27-3.16.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
    {loading ? "Connecting to Google..." : "Continue with Google"}
  </button>;
}
