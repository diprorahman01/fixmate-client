"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Wrench, RotateCcw } from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";
import { getPaginatedServices, SERVICE_CATEGORIES, type RepairService } from "@/lib/services";

const MODES = ["Home Visit", "Shop Drop-off"];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ServicesPage() {
  return <Suspense fallback={<section className="fixmate-container py-20 text-center">Loading services...</section>}><ServiceCatalog /></Suspense>;
}

function ServiceCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.toString();
  const filtered = Boolean(params.get("search") || params.get("category") || params.get("serviceMode") || params.get("sort"));
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [serviceMode, setServiceMode] = useState(params.get("serviceMode") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");
  const [services, setServices] = useState<RepairService[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  const pageSize = 12;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const current = new URLSearchParams(query);
    setSearch(current.get("search") ?? "");
    setCategory(current.get("category") ?? "");
    setServiceMode(current.get("serviceMode") ?? "");
    setSort(current.get("sort") ?? "newest");
    let active = true;
    setLoading(true);
    setError("");
    getPaginatedServices({
      search: current.get("search") ?? "",
      category: current.get("category") ?? "",
      serviceMode: current.get("serviceMode") ?? "",
      sort: current.get("sort") ?? "newest",
      limit: pageSize,
      page: Math.max(1, Math.min(10000, Number(current.get("page")) || 1)),
    }).then(data => { if (active) { setServices(data.services); setTotalPages(data.totalPages); setTotal(data.total); } })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Could not load services"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);

  function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (search.trim()) next.set("search", search.trim());
    if (category) next.set("category", category);
    if (serviceMode) next.set("serviceMode", serviceMode);
    if (sort !== "newest") next.set("sort", sort);
    router.push(`/services${next.size ? `?${next.toString()}` : ""}`);
  }

  function goPage(nextPage: number) {
    const next = new URLSearchParams(query);
    if (nextPage <= 1) next.delete("page"); else next.set("page", String(nextPage));
    router.push(`/services${next.size ? `?${next.toString()}` : ""}`);
  }

  function clear() {
    setSearch(""); setCategory(""); setServiceMode(""); setSort("newest");
    router.push("/services");
  }

  return <main className="min-h-[75vh] bg-muted/20 py-12 sm:py-16">
    <div className="fixmate-container">
      <div className="mb-9 max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary"><Wrench className="size-4"/> FIND A REPAIR</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Browse Repair Services</h1>
        <p className="mt-4 leading-7 text-muted-foreground">Explore approved services from FixMate technicians. Search, filter and compare before booking.</p>
      </div>
      <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
        <form onSubmit={apply} className="h-fit space-y-5 rounded-3xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-28" aria-label="Service filters">
          <h2 className="flex items-center gap-2 text-lg font-bold"><SlidersHorizontal className="size-5 text-primary"/> Filters</h2>
          <label className="block text-sm font-semibold">Search
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3"><Search className="size-4 text-muted-foreground"/><input aria-label="Search service title" value={search} onChange={e=>setSearch(e.target.value)} maxLength={100} placeholder="Laptop, AC, smartphone..." className="h-11 w-full min-w-0 bg-transparent text-sm outline-none"/></div>
          </label>
          <label className="block text-sm font-semibold">Category
            <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal">
              <option value="">All categories</option>{SERVICE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold">Service mode
            <select value={serviceMode} onChange={e=>setServiceMode(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal">
              <option value="">All modes</option>{MODES.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold">Sort by
            <select value={sort} onChange={e=>setSort(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal">
              {SORTS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <div className="flex gap-2"><button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">Apply Filters</button><button type="button" aria-label="Clear all filters" onClick={clear} className="rounded-xl border border-border px-3 hover:bg-muted"><RotateCcw className="size-4"/></button></div>
        </form>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{loading ? "Loading services..." : `${total} matching service${total === 1 ? "" : "s"} · Page ${page} of ${Math.max(totalPages,1)}`}</p></div>
          {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map(i=><div key={i} className="h-80 animate-pulse rounded-3xl bg-muted"/>)}</div> :
          error ? <div role="alert" className="rounded-2xl border border-destructive p-8 text-destructive">{error}</div> :
          services.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{services.map(service=><ServiceCard key={service._id} service={service}/>)}</div> :
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center"><Wrench className="mx-auto mb-4 size-12 text-primary"/><h2 className="text-xl font-bold">{filtered ? "No matching services" : "No approved services yet"}</h2><p className="mt-2 text-muted-foreground">{filtered ? "Try different filters or show all available services." : "Technicians can submit services. Once an Admin approves and enables them, they will appear here."}</p>{filtered && <button type="button" onClick={clear} className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Show All Services</button>}</div>}
          {!loading && !error && totalPages > 1 && <nav aria-label="Service pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => goPage(page-1)} disabled={page<=1} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            {Array.from({length:Math.min(totalPages,5)},(_,i)=>Math.max(1,Math.min(page-2,totalPages-4))+i).map(n=>(
              <button type="button" key={n} onClick={()=>goPage(n)} aria-current={n===page?"page":undefined} aria-label={`Page ${n}`} className={`min-w-10 rounded-xl px-3 py-2.5 text-sm font-bold ${n===page?"bg-primary text-primary-foreground":"border border-border bg-card hover:bg-muted"}`}>{n}</button>
            ))}
            <button type="button" onClick={() => goPage(page+1)} disabled={page>=totalPages} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </nav>}
        </div>
      </div>
    </div>
  </main>;
}
