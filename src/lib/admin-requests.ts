import { authenticatedFetch } from "@/lib/api-client";

type RequestStatus = "pending" | "approved" | "rejected";
export type AdminAccessRequest = {
  _id: string;
  userId: string;
  email: string;
  name: string;
  status: RequestStatus;
  createdAt: string;
};

async function parse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();
  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data && typeof data.message === "string" ? data.message : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function requestAdminAccess() {
  return parse<{status: RequestStatus}>(await authenticatedFetch("/api/admin-requests/request", {method:"POST"}));
}
export async function getAdminRequests() {
  return parse<AdminAccessRequest[]>(await authenticatedFetch("/api/admin-requests", {method:"GET"}));
}
export async function decideAdminRequest(id: string, decision: "approve" | "reject") {
  return parse<{success: boolean;message:string}>(await authenticatedFetch(`/api/admin-requests/${encodeURIComponent(id)}/decision`, {
    method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({decision}),
  }));
}
