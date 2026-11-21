import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { FIXMATE_CONTACT } from "@/config/contact";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];

type Social = { label: string; url: string; symbol: string };

/** Only render actual HTTPS profile URLs, never fake/default platform homepages. */
function profileLink(value: string, hosts: string[]): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !hosts.some((host) => hostname === host || hostname === `www.${host}`)) return null;
    if (url.pathname === "/" || url.pathname === "") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function Footer() {
  const social: Social[] = [
    { label: "Facebook", url: profileLink(FIXMATE_CONTACT.facebook, ["facebook.com", "fb.com"]) ?? "", symbol: "f" },
    { label: "Instagram", url: profileLink(FIXMATE_CONTACT.instagram, ["instagram.com"]) ?? "", symbol: "IG" },
    { label: "X", url: profileLink(FIXMATE_CONTACT.x, ["x.com", "twitter.com"]) ?? "", symbol: "𝕏" },
  ].filter((item) => item.url);

  const phoneDigits = FIXMATE_CONTACT.phone.replace(/[^\d+]/g, "");
  const phone = /^\+?\d{7,15}$/.test(phoneDigits) ? phoneDigits : "";
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(FIXMATE_CONTACT.email) ? FIXMATE_CONTACT.email : "";

  return (
    <footer className="border-t border-border bg-card">
      <div className="fixmate-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            FixMate makes device and home appliance repairs simple. Find trusted technicians,
            track your repair, and pay only after the work is completed.
          </p>
          {social.length > 0 && (
            <div className="flex items-center gap-3">
              {social.map(({ label, url, symbol }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={`FixMate on ${label}`}
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background font-bold transition-colors hover:border-primary hover:text-primary">
                  {symbol}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-6 text-base font-bold">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-base font-bold">Popular Categories</h3>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link href={`/services?category=${encodeURIComponent(category)}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">{category}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-base font-bold">Get in Touch</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            {email && (
              <a href={`mailto:${email}`} className="flex items-start gap-3 hover:text-primary">
                <Mail className="mt-0.5 size-4 shrink-0" />{email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-start gap-3 hover:text-primary">
                <Phone className="mt-0.5 size-4 shrink-0" />{FIXMATE_CONTACT.phone}
              </a>
            )}
            {FIXMATE_CONTACT.address.trim() && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{FIXMATE_CONTACT.address}</span>
              </div>
            )}
          </div>
          <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Find a Repair Service <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="fixmate-container flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Built for trusted, transparent repairs.</p>
        </div>
      </div>
    </footer>
  );
}
