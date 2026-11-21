
import { Suspense } from "react";
import ProfileEditor from "@/components/profile/profile-editor";

function ProfileLoading() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3">
        <div className="h-5 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-60 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-5 border-b border-border pb-6">
          <div className="size-24 animate-pulse rounded-3xl bg-muted" />

          <div className="space-y-3">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-9 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded-xl bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileEditor />
    </Suspense>
  );
}
