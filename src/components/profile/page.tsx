
import { Suspense } from "react";
import UpdateProfilePage from "@/components/profile/profile-editor";

function ProfileSkeleton() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-60 animate-pulse rounded bg-muted" />
        <div className="h-5 w-80 max-w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-5 border-b border-border pb-7">
          <div className="size-24 shrink-0 animate-pulse rounded-3xl bg-muted" />
          <div className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-9 w-36 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded-xl bg-muted" />
            </div>
          ))}
        </div>

        <div className="mt-6 h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UpdateProfilePage />
    </Suspense>
  );
}
