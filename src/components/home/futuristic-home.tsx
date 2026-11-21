"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, ArrowRight, ArrowUpRight, CalendarDays,
  ChevronRight, CreditCard, Cpu, Laptop, MapPin,
  Refrigerator, Search, ShieldCheck, Smartphone, Snowflake, Sparkles,
  Tv, WashingMachine, Wrench, Zap,
} from "lucide-react";
import { getServices, type RepairService } from "@/lib/services";

const categories = [
  { name: "Smartphone", Icon: Smartphone },
  { name: "Laptop & PC", Icon: Laptop },
  { name: "AC", Icon: Snowflake },
  { name: "Refrigerator", Icon: Refrigerator },
  { name: "TV", Icon: Tv },
  { name: "Washing Machine", Icon: WashingMachine },
  { name: "Electrical", Icon: Zap },
];

const steps = [
  { Icon: Search, title: "Find a Service", body: "Explore repair services for the device you need fixed." },
  { Icon: CalendarDays, title: "Send a Request", body: "Choose a service and share your preferred date." },
  { Icon: Wrench, title: "Technician Fixes It", body: "Track your repair from request to completion." },
  { Icon: CreditCard, title: "Pay After Completion", body: "Pay securely only when the job is finished." },
];

function ServiceTile({ service }: { service: RepairService }) {
  return (
    <article className="fm-service-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl">
      <Link href={`/services/${encodeURIComponent(service._id)}`} className="relative block aspect-[1.7] overflow-hidden bg-muted">
        {/* Remote service images may not be configured for next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image || "/assets/images/hero-technician.png"} alt={service.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{service.category}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-snug">{service.title}</h3>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0 text-primary" /><span className="truncate">{service.serviceArea || "Service area available"}</span></p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{service.serviceMode} <span className="mx-1">•</span> {service.technicianName}</p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-4">
          <div><span className="block text-[11px] text-muted-foreground">Starting from</span><strong className="text-xl text-primary">${Number(service.basePrice).toFixed(2)}</strong></div>
          <Link href={`/services/${encodeURIComponent(service._id)}`} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:brightness-110">Details <ArrowUpRight className="size-3.5" /></Link>
        </div>
      </div>
    </article>
  );
}

export default function FuturisticHome() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getServices({ limit: 6, sort: "newest" })
      .then((items) => { if (active) setServices(items.filter((item) => item.approvalStatus === "approved" && item.isAvailable)); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(search.trim() ? `/services?search=${encodeURIComponent(search.trim())}` : "/services");
  }

  return (
    <main className="fm-upgrade overflow-x-clip">
      <section className="fm-hero-v2 relative isolate overflow-hidden border-b border-border/60">
        <div className="fm-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="fm-hero-glow pointer-events-none absolute -right-24 top-0 h-[680px] w-[900px]" aria-hidden="true" />
        <div className="fixmate-container relative grid min-w-0 items-center gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-10 xl:gap-16 xl:py-20">
          <div className="relative z-10 min-w-0 max-w-[800px] space-y-7">
            <span className="fm-hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide"><Sparkles className="size-4 text-primary" /> THE NEXT GENERATION OF REPAIR SERVICES <span className="ml-1 size-1.5 rounded-full bg-primary" /></span>
            <div>
              <h1 className="fm-hero-heading font-black tracking-[-0.055em]">
                <span className="block">Broken device?</span>
                <span className="fm-accent-text block">Problem solved.</span>
              </h1>
              <p className="mt-5 max-w-[600px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">Connect with trusted repair technicians for your devices and home appliances. Book in minutes, track every step, and pay only when the job is done.</p>
            </div>
            <form onSubmit={submit} className="fm-hero-search flex w-full max-w-[680px] min-w-0 items-center gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl">
              <Search className="ml-3 size-5 shrink-0 text-primary" />
              <input aria-label="Search repair services" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search laptop, phone, AC repair..." className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-muted-foreground sm:px-2" />
              <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:brightness-110 sm:px-6">Find Services <ArrowRight className="hidden size-4 sm:block" /></button>
            </form>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Approved services</span>
              <span className="inline-flex items-center gap-2"><Activity className="size-4 text-cyan-500" /> Live job tracking</span>
              <span className="inline-flex items-center gap-2"><CreditCard className="size-4 text-primary" /> Pay after completion</span>
            </div>
            <div className="fm-system-strip flex max-w-[680px] flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl p-4 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 font-bold"><span className="fm-pulse inline-block size-2 rounded-full bg-primary" /> PLATFORM ONLINE</span>
              <span className="text-muted-foreground">01 / Find</span>
              <span className="text-muted-foreground">02 / Book</span>
              <span className="text-muted-foreground">03 / Repair</span>
              <span className="text-muted-foreground">04 / Pay</span>
            </div>
          </div>
          <div className="fm-visual-stage relative mx-auto w-full min-w-0 max-w-[720px] py-8 sm:px-6 lg:py-9">
            <div className="fm-image-orbit pointer-events-none absolute -inset-1 rounded-[3rem]" aria-hidden="true" />
            <div className="fm-image-shell relative overflow-hidden rounded-[2.2rem] border border-cyan-400/25 bg-card shadow-2xl">
              <div className="relative aspect-[1.05] min-h-[320px] sm:aspect-[1.15] lg:aspect-[1.03] xl:aspect-[1.2]">
                <Image src="/assets/images/hero-technician.png" alt="A skilled technician carefully repairing a device" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover object-center" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031320]/85 via-transparent to-transparent" />
                <div className="fm-scan-line pointer-events-none absolute inset-x-0 top-1/2 h-px" aria-hidden="true" />
                <span className="absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071422]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-lg"><span className="size-2 rounded-full bg-[#b9fa42]" /> PROFESSIONAL SERVICE NETWORK</span>
              </div>
            </div>
            <div className="fm-float fm-status-card absolute -right-1 top-3 flex items-center gap-3 rounded-2xl p-3 shadow-xl sm:-right-2 sm:top-9 sm:p-4"><ShieldCheck className="size-7 text-primary" /><div><p className="text-xs font-black">Trusted repairs</p><p className="mt-1 text-[11px] text-muted-foreground">Admin-approved listings</p></div></div>
            <div className="fm-float fm-float-delay fm-status-card absolute -bottom-1 -left-1 flex items-center gap-3 rounded-2xl p-3 shadow-xl sm:-left-3 sm:bottom-7 sm:p-4"><Activity className="size-7 text-cyan-500" /><div><p className="text-xs font-black">Track every stage</p><p className="mt-1 text-[11px] text-muted-foreground">From request to payment</p></div></div>
            <div className="fm-corner-number pointer-events-none absolute right-7 bottom-10 hidden text-[100px] font-black leading-none tracking-tighter text-white/10 sm:block">FM/01</div>
          </div>
        </div>
      </section>

      <section className="fixmate-container py-14 sm:py-16" id="categories">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">Find your fix</p><h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Explore Repair Categories</h2></div><Link href="/services" className="inline-flex items-center gap-1 text-sm font-bold text-primary">Browse all <ArrowRight className="size-4" /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{categories.map(({ name, Icon }) => <Link key={name} href={`/services?category=${encodeURIComponent(name)}`} className="fm-category-card group flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-2 py-5 text-center transition-all hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg"><Icon className="size-9 text-primary transition-transform group-hover:scale-110" strokeWidth={1.6} /><span className="text-xs font-bold">{name}</span></Link>)}</div>
      </section>

      <section className="fixmate-container pb-14 sm:pb-20" id="featured-services">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">Handpicked for your needs</p><h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Featured Repair Services</h2></div><Link href="/services" className="inline-flex items-center gap-1 text-sm font-bold text-primary">All Services <ArrowRight className="size-4" /></Link></div>
        {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />)}</div> : error ? <div role="status" className="rounded-2xl border border-border bg-card px-6 py-12 text-center"><p className="font-bold">Services are temporarily unavailable</p><p className="mt-2 text-sm text-muted-foreground">Please check again when the backend is available.</p><Link href="/services" className="mt-4 inline-flex items-center gap-2 text-primary">Browse Services <ArrowRight className="size-4" /></Link></div> : services.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{services.map((service) => <ServiceTile key={service._id} service={service} />)}</div> : <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center"><Wrench className="mx-auto mb-3 size-8 text-primary" /><p className="font-bold">No approved services available yet</p><p className="mt-2 text-sm text-muted-foreground">Technicians can submit listings for Admin approval.</p><Link href="/services" className="mt-4 inline-flex items-center gap-2 text-primary">Browse Services <ArrowRight className="size-4" /></Link></div>}
      </section>

      <section className="fm-flow border-t border-border/60 bg-card/25 py-14 sm:py-20">
        <div className="fixmate-container"><div className="mb-10 text-center"><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">One seamless journey</p><h2 className="text-3xl font-extrabold">How FixMate Works</h2><p className="mt-3 text-sm text-muted-foreground">A clear process from the first click to the final fix.</p></div>
          <div className="grid gap-4 md:grid-cols-4">{steps.map(({ Icon, title, body }, i) => <div key={title} className="fm-step-card relative rounded-2xl border border-border bg-card p-6 text-center"><span className="absolute right-4 top-3 text-xs font-bold text-muted-foreground">0{i + 1}</span><div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10"><Icon className="size-8 text-primary" /></div><h3 className="font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>{i < 3 && <ChevronRight className="absolute -right-5 top-1/2 z-10 hidden size-7 -translate-y-1/2 text-primary md:block" />}</div>)}</div>
        </div>
      </section>
      <section className="fixmate-container py-14 sm:py-20"><div className="fm-cta relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 sm:p-12"><div className="pointer-events-none absolute -right-10 -top-10 size-72 rounded-full bg-primary/10 blur-3xl" /><div className="relative max-w-2xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><Cpu className="size-4" /> Built for better repairs</p><h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Your next fix starts here.</h2><p className="mt-3 leading-7 text-muted-foreground">Explore trusted repair services, book in minutes and follow your job until it is complete.</p><Link href="/services" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Browse Repair Services <ArrowRight className="size-4" /></Link></div></div></section>
    </main>
  );
}
