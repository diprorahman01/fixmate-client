export default function ProfileLoading() {
  return <div className="mx-auto max-w-3xl animate-pulse space-y-4 p-6" aria-label="Loading profile">
    <div className="h-12 w-1/2 rounded-xl bg-muted" />
    <div className="h-72 rounded-3xl bg-muted" />
  </div>;
}
