
"use client";

import { useEffect, useState } from "react";
import { Loader2, ClipboardList } from "lucide-react";
import {
  getAdminBookings,
  type Booking,
} from "@/lib/bookings";

const statuses = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminBookings(status)
      .then((data) => {
        if (active) {
          setBookings(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load bookings"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  return (
    <section className="pb-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">
          Platform Monitoring
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">
          All Bookings
        </h1>
        <p className="mt-3 text-muted-foreground">
          Monitor repair bookings across FixMate.
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="admin-booking-filter"
          className="mb-2 block text-sm font-semibold"
        >
          Filter by Status
        </label>
        <select
          id="admin-booking-filter"
          value={status}
          onChange={(event) => {
            setLoading(true);
            setStatus(event.target.value);
          }}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm capitalize"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto mb-3 size-7 animate-spin text-primary" />
          Loading bookings...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 p-6 text-red-600"
        >
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <ClipboardList className="mx-auto mb-4 size-10 text-primary" />
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "Service",
                  "Customer",
                  "Technician",
                  "Preferred Date",
                  "Status",
                  "Payment",
                  "Amount",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t border-border"
                >
                  <td className="px-4 py-4 font-semibold">
                    {booking.serviceTitle}
                  </td>
                  <td className="px-4 py-4">
                    {booking.customerName}
                  </td>
                  <td className="px-4 py-4">
                    {booking.technicianName}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(
                      booking.preferredDate
                    ).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="px-4 py-4 capitalize">
                    {booking.status.replaceAll("-", " ")}
                  </td>
                  <td className="px-4 py-4 capitalize">
                    {booking.paymentStatus}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    ${Number(
                      booking.status === "completed"
                        ? booking.finalAmount
                        : booking.basePrice
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
