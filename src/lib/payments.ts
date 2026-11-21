
import {
  authenticatedFetch,
} from "@/lib/api-client";

// ==========================================
// PAYMENT TYPES
// ==========================================

export type Payment = {
  _id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  transactionId: string;
  sessionId: string;
  paidAt: string;
};

export type TransactionSummary = {
  totalRevenue: number;
  payments: Payment[];
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
      data !== null &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Payment request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}

// ==========================================
// CREATE STRIPE CHECKOUT
// ==========================================

export async function createCheckoutSession(
  bookingId: string
) {
  const response = await authenticatedFetch(
    "/api/payments/create-checkout-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId }),
    }
  );

  return parseResponse<{
    success: boolean;
    url: string;
  }>(response);
}

// ==========================================
// VERIFY STRIPE PAYMENT
// ==========================================

export async function verifyPayment(
  sessionId: string
) {
  const params = new URLSearchParams({
    session_id: sessionId,
  });

  const response = await authenticatedFetch(
    `/api/payments/verify?${params.toString()}`
  );

  return parseResponse<{
    success: boolean;
    message: string;
    payment: Payment;
  }>(response);
}

// ==========================================
// CUSTOMER PAYMENT HISTORY
// ==========================================

export async function getPaymentHistory() {
  const response = await authenticatedFetch(
    "/api/customer/payments"
  );

  return parseResponse<Payment[]>(response);
}

// ==========================================
// ADMIN TRANSACTIONS
// ==========================================

export async function getTransactions() {
  const response = await authenticatedFetch(
    "/api/admin/transactions"
  );

  return parseResponse<TransactionSummary>(
    response
  );
}
