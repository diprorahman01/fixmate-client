"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getVerifiedRole } from "@/lib/verified-role";
import { authorizedDestination } from "@/lib/safe-auth-redirect";

export default function AuthContinuePage() {
  return <Suspense fallback={<p className="p-12 text-center">Finishing sign in...</p>}><FinishSignIn /></Suspense>;
}

function FinishSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function complete() {
      // The JWT API provides the definitive role after OAuth.
      try {
        const role = await getVerifiedRole();
        if (active) { router.replace(authorizedDestination(role, next)); router.refresh(); }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to verify account");
      }
    }
    void complete();
    return () => { active = false; };
  }, [next, router]);
  return <section className="mx-auto max-w-lg p-12 text-center">
    {error ? <><h1 className="text-xl font-bold">Sign-in verification failed</h1><p className="mt-3 text-red-500">{error}</p><Link className="mt-5 inline-block text-primary" href="/sign-in">Return to Sign In</Link></> : <p>Completing your Google sign in...</p>}
  </section>;
}
