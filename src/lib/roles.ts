
export type UserRole =
  | "customer"
  | "technician"
  | "admin";

export function dashboardForRole(
  role: string | null | undefined
): string {
  if (role === "admin") {
    return "/dashboard/admin";
  }

  if (role === "technician") {
    return "/dashboard/technician";
  }

  return "/dashboard/customer";
}
