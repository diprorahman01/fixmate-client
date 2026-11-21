
import {
  authenticatedFetch,
} from "@/lib/api-client";

import type {
  RepairService,
  ServiceCategory,
} from "@/lib/services";

// ==========================================
// SERVICE TYPES
// ==========================================

export type ServiceInput = {
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
};

// ==========================================
// ERROR HANDLER
// ==========================================

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  return data as T;
}

// ==========================================
// GET MY SERVICES
// ==========================================

export async function getMyServices() {
  const response = await authenticatedFetch(
    "/api/technician/services"
  );

  return parseResponse<RepairService[]>(
    response
  );
}

// ==========================================
// GET ONE OWNED SERVICE
// ==========================================

export async function getMyService(id: string) {
  const response = await authenticatedFetch(
    `/api/technician/services/${encodeURIComponent(id)}`
  );

  return parseResponse<RepairService>(
    response
  );
}

// ==========================================
// CREATE SERVICE
// ==========================================

export async function createService(
  service: ServiceInput
) {
  const response = await authenticatedFetch(
    "/api/services",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// UPDATE SERVICE
// ==========================================

export async function updateService(
  id: string,
  service: ServiceInput
) {
  const response = await authenticatedFetch(
    `/api/services/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// DELETE SERVICE
// ==========================================

export async function deleteService(
  id: string
) {
  const response = await authenticatedFetch(
    `/api/services/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// UPDATE AVAILABILITY
// ==========================================

export async function setServiceAvailability(
  id: string,
  isAvailable: boolean
) {
  const response = await authenticatedFetch(
    `/api/services/${encodeURIComponent(id)}/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAvailable }),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// UPLOAD IMAGE
// ==========================================

export async function uploadServiceImage(
  file: File
): Promise<string> {
  const data = new FormData();
  data.append("image", file);

  const response = await fetch(
    "/api/upload-image",
    {
      method: "POST",
      body: data,
      credentials: "same-origin",
    }
  );

  const result = await parseResponse<{
    success: boolean;
    url: string;
  }>(response);

  return result.url;
}
