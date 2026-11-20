
export const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

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

export type ServiceQuery = {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  limit?: number;
};

export async function getServices(
  query: ServiceQuery = {}
): Promise<RepairService[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000";

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

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/services?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();

    // The initial API will return an array.
    // Never assume that an unexpected response
    // is valid service data.
    if (!Array.isArray(data)) {
      return [];
    }

    return data as RepairService[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}
