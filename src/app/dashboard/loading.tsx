export default function DashboardLoading() {
  return <div className="animate-pulse space-y-6 p-6" role="status" aria-label="Loading dashboard"><div className="h-12 w-64 rounded-xl bg-muted"/><div className="grid gap-5 md:grid-cols-3">{[1,2,3].map(i=><div key={i} className="h-36 rounded-3xl bg-muted"/>)}</div><div className="h-72 rounded-3xl bg-muted"/></div>;
}
