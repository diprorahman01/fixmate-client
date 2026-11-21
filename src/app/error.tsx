"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Route error:", error); }, [error]);
  return <section role="alert" className="flex min-h-[65vh] items-center justify-center p-6 text-center"><div className="max-w-lg rounded-3xl border border-border bg-card p-10 shadow-sm"><AlertTriangle className="mx-auto size-12 text-destructive"/><h1 className="mt-5 text-2xl font-bold">Something went wrong</h1><p className="mt-3 text-muted-foreground">This page couldn't load. Please try again.</p><button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"><RotateCcw className="size-4"/> Try Again</button></div></section>;
}
