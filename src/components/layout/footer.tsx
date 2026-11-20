
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";;

import { Logo } from "@/components/shared/logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="fixmate-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-5">
          <Logo />

          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            FixMate makes device and home appliance
            repairs simple. Find trusted technicians,
            track your repair, and pay only after
            the work is completed.
          </p>

          <div className="flex items-center gap-3">
            <SocialLink
              label="Facebook"
              href="https://www.facebook.com/"
            >
              <span className="text-sm font-bold">f</span>
            </SocialLink>

            <SocialLink
              label="Instagram"
              href="https://www.instagram.com/"
            >
              <span className="text-xs font-bold">IG</span>
            </SocialLink>

            <SocialLink
              label="X"
              href="https://x.com/"
            >
              <span className="text-lg font-semibold">
                𝕏
              </span>
            </SocialLink>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Quick Links
          </h3>

          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Popular Categories
          </h3>

          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Get in Touch
          </h3>

          <div className="space-y-4 text-sm text-muted-foreground">
            <a
              href="mailto:support@fixmate.example"
              className="flex items-start gap-3 hover:text-primary"
            >
              <Mail className="mt-0.5 size-4 shrink-0" />
              support@fixmate.example
            </a>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>Contact number coming soon</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Find a Repair Service
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="fixmate-container flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p>
  © 2026 FixMate. All rights reserved.
</p>

          <p>
            Built for trusted, transparent repairs.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-primary hover:text-primary"
    >
      {children}
    </a>
  );
}
