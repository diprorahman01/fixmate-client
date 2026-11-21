
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Wrench,
} from "lucide-react";

import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { dashboardForRole } from "../../lib/roles";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          Loading sign in...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        const message =
          result.error.message ||
          "Invalid email or password";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Signed in successfully!");

      

const callbackURL = searchParams.get("callbackURL");

const isSafeCallback =
  typeof callbackURL === "string" &&
  callbackURL.startsWith("/") &&
  !callbackURL.startsWith("//") &&
  !callbackURL.startsWith("/\\");

const destination: string =
  isSafeCallback && callbackURL
    ? callbackURL
    : dashboardForRole(result.data?.user?.role);

router.replace(destination);
router.refresh();


    } catch {
      toast.error(
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-7" />
          </div>

          <h1 className="text-3xl font-extrabold">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to continue your FixMate journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 outline-none focus:border-primary"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(!showPassword)
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
          </div>

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
              ? "Signing in..."
              : "Sign In"}

            {!loading && (
              <ArrowRight className="size-4" />
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <LockKeyhole className="size-4 text-primary" />
          Protected by Better Auth
        </div>
      </div>
    </section>
  );
}
