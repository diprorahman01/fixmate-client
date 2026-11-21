import { redirect } from "next/navigation";

/** Public Admin registration is intentionally unavailable. */
export default function AdminSignUpPage() {
  redirect("/sign-up");
}
