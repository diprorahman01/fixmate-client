"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CalendarDays, CheckCircle2, CreditCard,
  Laptop, Refrigerator, Search, ShieldCheck, Smartphone, Snowflake,
  Tv, WashingMachine, Wrench, Zap, ArrowUpRight, MapPin,
  Activity, Cpu, ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getServices, type RepairService } from "@/lib/services";

const categories = [
  {name:"Smartphone", Icon:Smartphone}, {name:"Laptop & PC", Icon:Laptop},
  {name:"AC",Icon:Snowflake}, {name:"Refrigerator",Icon:Refrigerator},
  {name:"TV",Icon:Tv}, {name:"Washing Machine",Icon:WashingMachine},
  {name:"Electrical",Icon:Zap},
];
const steps = [
  {Icon:Search,title:"Find a Service",desc:"Explore approved repair services for your device."},
  {Icon:CalendarDays,title:"Send a Request",desc:"Describe the issue, address and preferred date."},
  {Icon:Wrench,title:"Technician Fixes It",desc:"Track progress as your technician completes the job."},
  {Icon:CreditCard,title:"Pay After Completion",desc:"Pay securely after the repair is finished."},
];

function ServiceTile({service}:{service:RepairService}) {
  return <article className="fm-service-card group overflow-hidden rounded-2xl border border-border bg-card">
    <Link href={`/services/${encodeURIComponent(service._id)}`} className="block relative aspect-[1.7] overflow-hidden bg-muted">
      {/* External ImgBB images may not be configured for next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={service.image || "/assets/images/hero-technician.png"} alt={service.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
      <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{service.category}</span>
    </Link>
    <div className="space-y-3 p-4">
      <div className="min-h-14"><h3 className="line-clamp-2 text-base font-bold leading-snug">{service.title}</h3></div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5"/>{service.serviceArea || "Service area available"}</p>
      <p className="text-xs text-muted-foreground">{service.serviceMode} <span className="px-1">•</span> {service.technicianName}</p>
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <div><span className="block text-xs text-muted-foreground">Starting from</span><strong className="text-lg text-primary">${Number(service.basePrice).toFixed(2)}</strong></div>
        <Link href={`/services/${encodeURIComponent(service._id)}`} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground hover:opacity-90">Details <ArrowUpRight className="size-3.5"/></Link>
      </div>
    </div>
  </article>;
}

export default function FuturisticHome() {
  const router=useRouter();
  const [search,setSearch]=useState("");
  const [services,setServices]=useState<RepairService[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);
  useEffect(()=>{
    let live=true;
    getServices({limit:6,sort:"newest"})
      .then(items=>{if(live)setServices(items.filter(x=>x.approvalStatus==="approved" && x.isAvailable));})
      .catch(()=>{if(live)setError(true);})
      .finally(()=>{if(live)setLoading(false);});
    return ()=>{live=false;};
  },[]);
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(search.trim()?`/services?search=${encodeURIComponent(search.trim())}`:"/services");
  }
  return <main className="fm-future overflow-hidden">
    <section className="fm-hero relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute -right-24 -top-52 size-[650px] rounded-full bg-cyan-400/10 blur-[110px]"/>
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[440px] rounded-full bg-primary/10 blur-[110px]"/>
      <div className="fixmate-container relative grid items-center gap-9 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-foreground"><Zap className="size-4 text-primary"/> On-Demand Smart Repair Platform</div>
          <h1 className="text-4xl font-black leading-[1.07] tracking-tight sm:text-5xl lg:text-[clamp(3.2rem,4.4vw,5.3rem)]">Get Your Devices &amp; Home Appliances Fixed by <span className="fm-shine">Verified Technicians</span></h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Find repair services, request a technician, follow every stage of the job, and pay only after completion.</p>
          <form onSubmit={submit} className="flex max-w-xl items-center rounded-xl border border-border bg-card/90 p-1.5 shadow-xl shadow-cyan-900/10">
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground"/>
            <input aria-label="Search repair services" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find laptop, AC, smartphone repair..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"/>
            <button type="submit" className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition hover:brightness-110"><span className="hidden sm:inline">Find Services</span><Search className="size-4"/></button>
          </form>
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary"/> Approved Services</span>
            <span className="flex items-center gap-1.5"><Activity className="size-4 text-cyan-400"/> Job Progress Tracking</span>
            <span className="flex items-center gap-1.5"><CreditCard className="size-4 text-primary"/> Pay After Repair</span>
          </div>
        </div>
        <div className="fm-hero-visual relative mx-auto w-full max-w-[660px]">
          <div className="pointer-events-none absolute -inset-3 rounded-[3rem] border border-primary/30"/>
          <div className="relative aspect-[1.24] overflow-hidden rounded-[2.6rem] border border-cyan-400/30 bg-card shadow-[0_25px_90px_rgba(0,224,245,.12)]">
            <Image src="/assets/images/hero-technician.png" alt="Technician carefully repairing an electronic device" fill priority className="object-cover object-center" sizes="(max-width:1024px) 100vw, 50vw"/>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061522]/65 via-transparent to-transparent"/>
          </div>
          <div className="fm-float absolute -right-2 top-7 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-card/95 p-3 shadow-2xl backdrop-blur-lg sm:-right-5"><ShieldCheck className="size-7 text-primary"/><span className="text-xs font-bold">Admin-Approved<br/>Services</span></div>
          <div className="fm-float fm-float-delay absolute -left-3 bottom-16 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-card/95 p-3 shadow-2xl backdrop-blur-lg sm:-left-7"><Activity className="size-7 text-cyan-400"/><span className="text-xs font-bold">Track Your<br/>Repair Status</span></div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-border bg-background/90 px-4 py-2 text-xs font-semibold backdrop-blur-md"><CheckCircle2 className="size-4 text-primary"/> Payment after completion</div>
        </div>
      </div>
    </section>

    <section className="fixmate-container py-12 sm:py-16" id="categories">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">Explore categories</p><h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Repair by Category</h2></div><Link href="/services" className="flex items-center gap-1 text-sm font-bold text-primary">View All <ArrowRight className="size-4"/></Link></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{categories.map(({name,Icon})=><Link key={name} href={`/services?category=${encodeURIComponent(name)}`} className="fm-category-card group flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-2 py-4 text-center transition-all hover:-translate-y-1 hover:border-primary/70"><Icon className="size-9 text-primary transition-transform group-hover:scale-110" strokeWidth={1.6}/><span className="text-xs font-bold">{name}</span></Link>)}</div>
    </section>

    <section className="fixmate-container pb-14 sm:pb-20" id="featured-services">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">Explore verified listings</p><h2 className="text-2xl font-extrabold sm:text-3xl">Featured Repair Services</h2></div><Link href="/services" className="flex items-center gap-1 text-sm font-bold text-primary">All Services <ArrowRight className="size-4"/></Link></div>
      {loading?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-80 animate-pulse rounded-2xl bg-muted"/>)}</div>:
      error?<div role="status" className="rounded-2xl border border-border bg-card px-6 py-12 text-center"><p className="font-bold">Services are temporarily unavailable</p><p className="mt-2 text-sm text-muted-foreground">Check the service catalog when the backend is available.</p><Link className="mt-4 inline-flex gap-2 text-primary" href="/services">Browse Services <ArrowRight className="size-4"/></Link></div>:
      services.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{services.map(service=><ServiceTile key={service._id} service={service}/>)}</div>:
      <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center"><Wrench className="mx-auto mb-3 size-8 text-primary"/><p className="font-bold">No approved services available yet</p><p className="mt-2 text-sm text-muted-foreground">Technicians can add listings and an admin can approve them.</p><Link href="/services" className="mt-4 inline-flex gap-2 text-primary">Browse Services <ArrowRight className="size-4"/></Link></div>}
    </section>

    <section className="fm-flow relative border-t border-border/60 bg-card/25 py-14 sm:py-20">
      <div className="fixmate-container"><div className="mb-10 text-center"><p className="mb-2 text-xs font-bold uppercase tracking-[.17em] text-primary">Simple & transparent</p><h2 className="text-3xl font-extrabold">How FixMate Works</h2><p className="mt-3 text-sm text-muted-foreground">From booking to payment in four straightforward steps.</p></div>
        <div className="grid gap-4 md:grid-cols-4">{steps.map(({Icon,title,desc},i)=><div className="fm-step-card relative rounded-2xl border border-border bg-card p-6 text-center" key={title}><span className="absolute right-4 top-3 text-xs font-bold text-muted-foreground">0{i+1}</span><div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10"><Icon className="size-8 text-primary"/></div><h3 className="font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>{i<3&&<ChevronRight className="absolute -right-5 top-1/2 z-10 hidden size-7 -translate-y-1/2 text-primary md:block"/>}</div>)}</div>
      </div>
    </section>

    <section className="fixmate-container py-16 sm:py-20"><div className="fm-cta relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-7 sm:p-12"><div className="pointer-events-none absolute -right-10 -top-10 size-72 rounded-full bg-primary/10 blur-3xl"/><div className="relative max-w-2xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><Cpu className="size-4"/> Smart repair services</p><h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">One place for every repair.</h2><p className="mt-3 leading-7 text-muted-foreground">Discover available services, track requests and stay in control until the repair is complete.</p><Link href="/services" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Browse Repair Services <ArrowRight className="size-4"/></Link></div></div></section>
  </main>;
}
