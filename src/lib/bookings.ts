
import {
  authenticatedFetch,
} from "@/lib/api-client";

// ==========================================
// BOOKING TYPES
// ==========================================
export type BookingHistoryEntry = {
  status:
    | "requested"
    | "accepted"
    | "in-progress"
    | "completed"
    | "rejected"
    | "cancelled"
    | "paid";
  changedAt: string;
};

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid";

export type Booking = {
  _id: string;

  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;

  technicianName: string;
  technicianEmail: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;

  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;

    statusHistory?: BookingHistoryEntry[];
  paidAt?: string;

  createdAt: string;
  updatedAt: string;
};

export type BookingInput = {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

// ==========================================
// RESPONSE HELPER
// ==========================================

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}

// ==========================================
// CUSTOMER: CREATE BOOKING
// ==========================================

export async function createBooking(
  booking: BookingInput
) {
  const response = await authenticatedFetch(
    "/api/bookings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
    booking: Booking;
  }>(response);
}

// ==========================================
// CUSTOMER: MY BOOKINGS
// ==========================================

export async function getMyBookings() {
  const response = await authenticatedFetch(
    "/api/customer/bookings"
  );

  return parseResponse<Booking[]>(response);
}

// ==========================================
// CUSTOMER: CANCEL BOOKING
// ==========================================

export async function cancelBooking(id: string) {
  const response = await authenticatedFetch(
    `/api/bookings/${encodeURIComponent(id)}/cancel`,
    {
      method: "PATCH",
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// TECHNICIAN: INCOMING REQUESTS
// ==========================================

export async function getTechnicianRequests(
  status: string = "all"
) {
  const params = new URLSearchParams({
    status,
  });

  const response = await authenticatedFetch(
    `/api/technician/requests?${params.toString()}`
  );

  return parseResponse<Booking[]>(response);
}

// ==========================================
// TECHNICIAN: UPDATE STATUS
// ==========================================

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  finalAmount?: number
) {
  const response = await authenticatedFetch(
    `/api/technician/requests/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        ...(finalAmount !== undefined
          ? { finalAmount }
          : {}),
      }),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// ADMIN: ALL BOOKINGS
// ==========================================

export async function getAdminBookings(
  status: string = "all"
) {
  const params = new URLSearchParams({
    status,
  });

  const response = await authenticatedFetch(
    `/api/admin/bookings?${params.toString()}`
  );

  return parseResponse<Booking[]>(response);
}
