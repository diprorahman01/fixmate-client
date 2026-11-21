
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  Wrench,
  RotateCcw,
} from "lucide-react";

import { ServiceCard } from "@/components/services/service-card";

import {
  getPaginatedServices,
  SERVICE_CATEGORIES,
  type RepairService,
} from "@/lib/services";

const MODES = ["Home Visit", "Shop Drop-off"];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PAGE_SIZE = 12;

type Filters = {
  search: string;
  category: string;
  serviceMode: string;
  sort: string;
};

type CatalogResult = {
  services: RepairService[];
  total: number;
  totalPages: number;
};

function getPage(value: string | null) {
  const number = Number(value);

  if (!Number.isSafeInteger(number)) return 1;

  return Math.max(1, Math.min(10000, number));
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="fixmate-container py-20 text-center">
          Loading services...
        </div>
      }
    >
      <ServicesRoute />
    </Suspense>
  );
}

function ServicesRoute() {
  const params = useSearchParams();
  const query = params.toString();

  // Remount only when the URL filters change.
  // This avoids setting form state inside useEffect.
  return <ServiceCatalog key={query} query={query} />;
}

function ServiceCatalog({ query }: { query: string }) {
  const router = useRouter();

  const current = new URLSearchParams(query);

  const page = getPage(current.get("page"));

  const filtered = Boolean(
    current.get("search") ||
      current.get("category") ||
      current.get("serviceMode") ||
      current.get("sort")
  );

  const [filters, setFilters] = useState<Filters>({
    search: current.get("search") ?? "",
    category: current.get("category") ?? "",
    serviceMode: current.get("serviceMode") ?? "",
    sort: current.get("sort") ?? "newest",
  });

  const [result, setResult] = useState<CatalogResult>({
    services: [],
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const options = new URLSearchParams(query);

    getPaginatedServices({
      search: options.get("search") ?? "",
      category: options.get("category") ?? "",
      serviceMode: options.get("serviceMode") ?? "",
      sort: options.get("sort") ?? "newest",
      limit: PAGE_SIZE,
      page: getPage(options.get("page")),
    })
      .then((data) => {
        if (!active) return;

        setResult({
          services: data.services,
          total: data.total,
          totalPages: data.totalPages,
        });
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Could not load services"
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  function changeFilter(
    field: keyof Filters,
    value: string
  ) {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = new URLSearchParams();

    if (filters.search.trim()) {
      next.set("search", filters.search.trim());
    }

    if (filters.category) {
      next.set("category", filters.category);
    }

    if (filters.serviceMode) {
      next.set("serviceMode", filters.serviceMode);
    }

    if (filters.sort !== "newest") {
      next.set("sort", filters.sort);
    }

    router.push(
      `/services${next.size ? `?${next.toString()}` : ""}`
    );
  }

  function clear() {
    setFilters({
      search: "",
      category: "",
      serviceMode: "",
      sort: "newest",
    });

    router.push("/services");
  }

  function goPage(nextPage: number) {
    if (
      nextPage < 1 ||
      nextPage > result.totalPages
    ) {
      return;
    }

    const next = new URLSearchParams(query);

    if (nextPage === 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }

    router.push(
      `/services${next.size ? `?${next.toString()}` : ""}`
    );
  }

  const pageCount = Math.max(1, result.totalPages);

  const numberOfButtons = Math.min(pageCount, 5);

  const startPage = Math.max(
    1,
    Math.min(
      page - 2,
      pageCount - numberOfButtons + 1
    )
  );

  const pageNumbers = Array.from(
    { length: numberOfButtons },
    (_, index) => startPage + index
  );

  return (
    <main className="min-h-[75vh] bg-muted/20 py-10 sm:py-14">
      <div className="fixmate-container">
        <div className="mb-9">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Wrench className="size-4" />
            FIND A REPAIR
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Browse Repair Services
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Explore approved services from FixMate
            technicians. Search, filter and compare
            before booking.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          <form
            onSubmit={apply}
            aria-label="Service filters"
            className="h-fit space-y-5 rounded-3xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-28"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <SlidersHorizontal className="size-5 text-primary" />
              Filters
            </h2>

            <label className="block text-sm font-semibold">
              Search

              <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />

                <input
                  aria-label="Search service title"
                  value={filters.search}
                  onChange={(event) =>
                    changeFilter("search", event.target.value)
                  }
                  maxLength={100}
                  placeholder="Laptop, AC, smartphone..."
                  className="h-11 w-full min-w-0 bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="block text-sm font-semibold">
              Category

              <select
                value={filters.category}
                onChange={(event) =>
                  changeFilter("category", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal"
              >
                <option value="">All categories</option>

                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold">
              Service mode

              <select
                value={filters.serviceMode}
                onChange={(event) =>
                  changeFilter("serviceMode", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal"
              >
                <option value="">All modes</option>

                {MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold">
              Sort by

              <select
                value={filters.sort}
                onChange={(event) =>
                  changeFilter("sort", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal"
              >
                {SORTS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                Apply Filters
              </button>

              <button
                type="button"
                aria-label="Clear all filters"
                onClick={clear}
                className="rounded-xl border border-border px-3 hover:bg-muted"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </form>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading services..."
                  : `${result.total} matching ${
                      result.total === 1 ? "service" : "services"
                    } · Page ${page} of ${pageCount}`}
              </p>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-3xl bg-muted"
                  />
                ))}
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive bg-card p-8 text-destructive"
              >
                {error}
              </div>
            ) : result.services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <Wrench className="mx-auto mb-4 size-12 text-primary" />

                <h2 className="text-xl font-bold">
                  {filtered
                    ? "No matching services"
                    : "No approved services yet"}
                </h2>

                <p className="mt-2 text-muted-foreground">
                  {filtered
                    ? "Try different filters or show all available services."
                    : "Services will appear once an Admin approves them."}
                </p>

                {filtered && (
                  <button
                    type="button"
                    onClick={clear}
                    className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
                  >
                    Show All Services
                  </button>
                )}
              </div>
            )}

            {!loading &&
              !error &&
              pageCount > 1 && (
                <nav
                  aria-label="Service pages"
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => goPage(number)}
                      aria-current={
                        number === page ? "page" : undefined
                      }
                      aria-label={`Page ${number}`}
                      className={`min-w-10 rounded-xl px-3 py-2.5 text-sm font-bold ${
                        number === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card hover:bg-muted"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goPage(page + 1)}
                    disabled={page >= pageCount}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
