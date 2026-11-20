
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import type { RepairService } from "@/lib/services";

type ServiceCardProps = {
  service: RepairService;
};

export function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Image unavailable
          </div>
        )}

        <span className="absolute top-4 left-4 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-12 text-lg font-bold leading-6">
          {service.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">
              {service.serviceArea}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0 text-primary" />
            <span>
              {service.estimatedDuration}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-primary" />
            <span className="truncate">
              {service.technicianName}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            {service.serviceMode}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Starting from
            </p>

            <p className="text-2xl font-bold">
              ${service.basePrice.toFixed(2)}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Details
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
