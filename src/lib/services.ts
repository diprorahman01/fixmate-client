
export const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

// ==========================================
// TYPES
// ==========================================

export type ServiceCategory =
  (typeof SERVICE_CATEGORIES)[number];

export type RepairService = {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
};

// Technician public profile
export type TechnicianSummary = {
  name: string;
  image?: string | null;
  area?: string | null;
  bio?: string | null;
};

// Single service with technician information
export type ServiceDetails = RepairService & {
  technician: TechnicianSummary | null;
};

// Search and filter parameters
export type ServiceQuery = {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  limit?: number;
};

// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

// ==========================================
// GET ALL APPROVED SERVICES
// ==========================================

export async function getServices(
  query: ServiceQuery = {}
): Promise<RepairService[]> {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.serviceMode) {
    params.set("serviceMode", query.serviceMode);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  try {
    const response = await fetch(
      `${API_URL}/api/services?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load services: ${response.status}`
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid services API response");
    }

    return data as RepairService[];
  } catch (error) {
    console.error("Error loading services:", error);
    return [];
  }
}

// ==========================================
// GET SINGLE SERVICE BY ID
// ==========================================

export async function getServiceById(
  id: string
): Promise<ServiceDetails | null> {
  const response = await fetch(
    `${API_URL}/api/services/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    }
  );

  // Service doesn't exist or isn't public
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load service: ${response.status}`
    );
  }

  const data: ServiceDetails = await response.json();

  return data;
}
