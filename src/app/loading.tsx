export default function Loading() {
  return <div className="fixmate-container animate-pulse space-y-6 py-12" role="status" aria-label="Loading page"><div className="h-9 w-64 rounded-xl bg-muted"/><div className="h-5 w-96 max-w-full rounded-xl bg-muted"/><div className="grid gap-6 md:grid-cols-3">{[1,2,3].map(i=><div key={i} className="h-48 rounded-3xl bg-muted"/>)}</div></div>;
}
