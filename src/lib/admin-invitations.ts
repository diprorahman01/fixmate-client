import { authenticatedFetch } from "@/lib/api-client";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function read<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();
  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data && typeof data.message === "string"
      ? data.message : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export type AdminInvitation = {
  success: boolean;
  email: string;
  code: string;
  expiresAt: string;
};

export async function validateAdminInvitation(email: string, code: string) {
  return read<{ valid: boolean }>(await fetch(`${apiBase}/api/admin-invitations/validate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim().toLowerCase() }),
    cache: "no-store",
  }));
}

export async function createAdminInvitation(email: string) {
  return read<AdminInvitation>(await authenticatedFetch("/api/admin-invitations", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  }));
}

export async function redeemAdminInvitation(code: string) {
  return read<{ success: boolean; role: "admin"; message: string }>(
    await authenticatedFetch("/api/admin-invitations/redeem", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toLowerCase() }),
    })
  );
}
