import { redirect } from "next/navigation";

// All three roles use the same Better Auth sign-in form.
// The shared sign-in route redirects using the verified role.
export default function AdminSignInPage() {
  redirect("/sign-in");
}
