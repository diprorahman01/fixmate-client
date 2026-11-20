
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

import {
  getServices,
  SERVICE_CATEGORIES,
} from "@/lib/services";

import { ServiceCard } from "@/components/services/service-card";

export const metadata: Metadata = {
  title: "Browse Repair Services",
  description:
    "Browse approved repair services for smartphones, laptops and home appliances with FixMate.",
};

// ==================================================
// TYPES
// ==================================================

type SearchParams = {
  search?: string | string[];
  category?: string | string[];
  serviceMode?: string | string[];
  sort?: string | string[];
};

type ServicesPageProps = {
  searchParams: Promise<SearchParams>;
};

// ==================================================
// HELPER FUNCTION
// ==================================================

function getString(value?: string | string[]) {
  return typeof value === "string" ? value : "";
}

// ==================================================
// MAIN SERVICES PAGE
// ==================================================

export default function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="border-b border-border bg-muted/35 py-16">
        <div className="fixmate-container">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Wrench className="size-4" />
            FixMate Repair Services
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find the Right{" "}
            <span className="fixmate-gradient-text">
              Repair Service
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Explore trusted repair services for your
            smartphones, laptops, and home appliances.
            Search, compare, and choose the service
            that meets your needs.
          </p>
        </div>
      </section>

      {/* DYNAMIC SERVICES SECTION */}
      <section className="py-12 sm:py-16">
        <div className="fixmate-container">
          <Suspense fallback={<ServicesLoadingSkeleton />}>
            <ServicesContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

// ==================================================
// DYNAMIC SERVICES CONTENT
// ==================================================
//
// Next.js 16 may block uncached fetch requests
// during prerendering.
//
// By rendering this async component inside
// Suspense, the page can display a loading
// fallback while the service data loads.
//

async function ServicesContent({
  searchParams,
}: ServicesPageProps) {
  const params = await searchParams;

  const search = getString(params.search);
  const category = getString(params.category);
  const serviceMode = getString(params.serviceMode);
  const sort = getString(params.sort) || "newest";

  // Fetch service data from the Express backend.
  // Filtering and sorting will be implemented
  // in MongoDB rather than in the browser.
  const services = await getServices({
    search,
    category,
    serviceMode,
    sort,
  });

  return (
    <>
      {/* ============================================
          SEARCH & FILTER PANEL
      ============================================ */}

      <form
        action="/services"
        method="GET"
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Find Your Repair Service
            </h2>

            <p className="text-sm text-muted-foreground">
              Search and filter available services
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div>
            <label
              htmlFor="service-search"
              className="mb-2 block text-sm font-semibold"
            >
              Search Services
            </label>

            <div className="relative">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="service-search"
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Phone, AC, laptop..."
                className="h-12 w-full rounded-xl border border-input bg-background pr-4 pl-11 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              defaultValue={category}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">
                All Categories
              </option>

              {SERVICE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode Filter */}
          <div>
            <label
              htmlFor="serviceMode"
              className="mb-2 block text-sm font-semibold"
            >
              Service Mode
            </label>

            <select
              id="serviceMode"
              name="serviceMode"
              defaultValue={serviceMode}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">
                All Service Modes
              </option>

              <option value="Home Visit">
                Home Visit
              </option>

              <option value="Shop Drop-off">
                Shop Drop-off
              </option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-semibold"
            >
              Sort By
            </label>

            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search className="size-4" />
            Apply Filters
          </button>

          <Link
            href="/services"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Clear All
          </Link>
        </div>
      </form>

      {/* ============================================
          RESULTS HEADING
      ============================================ */}

      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-widest text-primary">
            AVAILABLE REPAIRS
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Browse Services
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {services.length} services returned
          </p>
        </div>
      </div>

      {/* ============================================
          SERVICE RESULTS
      ============================================ */}

      {services.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Wrench className="size-10" />
          </div>

          <h3 className="mt-7 text-2xl font-bold">
            No Repair Services Found
          </h3>

          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            No services are available for the
            selected filters. Try changing your
            search or check back when approved
            services are available.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Clear Filters
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}

// ==================================================
// LOADING SKELETON
// ==================================================
//
// Displayed while Next.js waits for dynamic
// service data inside the Suspense boundary.
//

function ServicesLoadingSkeleton() {
  return (
    <div className="space-y-10">
      {/* Filter Skeleton */}
      <div className="animate-pulse rounded-2xl border border-border bg-card p-7">
        <div className="mb-6 h-6 w-48 rounded bg-muted" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-4 w-24 rounded bg-muted" />

              <div className="h-12 rounded-xl bg-muted" />
            </div>
          ))}
        </div>

        <div className="mt-6 h-12 w-40 rounded-xl bg-muted" />
      </div>

      {/* Service Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[16/10] bg-muted" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 rounded bg-muted" />

              <div className="h-4 w-1/2 rounded bg-muted" />

              <div className="h-4 w-2/3 rounded bg-muted" />

              <div className="h-10 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
