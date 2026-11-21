
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

type UserRole = "customer" | "technician";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<UserRole>("customer");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordValid =
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Enter a valid email address");
      return;
    }

    if (!passwordValid) {
      setError(
        "Use at least 6 characters, one uppercase and one lowercase letter"
      );
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (result.error) {
        const message =
          result.error.message ||
          "Registration failed";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success(
        "Account created successfully!"
      );

      router.push(
        role === "technician"
          ? "/dashboard/technician"
          : "/dashboard/customer"
      );

      router.refresh();
    } catch {
      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-7" />
          </div>

          <h1 className="text-3xl font-extrabold">
            Join FixMate
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Create an account to start your repair journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold"
            >
              Full Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              At least 6 characters, one uppercase
              and one lowercase letter.
            </p>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold">
              Register As
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setRole("customer")
                }
                aria-pressed={role === "customer"}
                className={`rounded-2xl border p-5 text-center transition-colors ${
                  role === "customer"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <UserRound className="mx-auto mb-3 size-7 text-primary" />
                <p className="font-semibold">
                  Customer
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Book repairs
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setRole("technician")
                }
                aria-pressed={role === "technician"}
                className={`rounded-2xl border p-5 text-center transition-colors ${
                  role === "technician"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Wrench className="mx-auto mb-3 size-7 text-primary" />
                <p className="font-semibold">
                  Technician
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Offer services
                </p>
              </button>
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}

            {!loading && (
              <ArrowRight className="size-4" />
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Secure account registration
        </div>
      </div>
    </section>
  );
}
