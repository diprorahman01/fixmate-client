
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="fixmate-container flex h-20 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                isActive(link.href) ? "page" : undefined
              }
              className={cn(
                "relative py-2 text-sm font-medium transition-colors",
                "hover:text-primary",
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className={buttonVariants()}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="fixmate-mobile-menu"
          >
            {menuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          id="fixmate-mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background p-4 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={
                  isActive(link.href) ? "page" : undefined
                }
                className={cn(
                  buttonVariants({
                    variant: isActive(link.href)
                      ? "secondary"
                      : "ghost",
                  }),
                  "w-full justify-start"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-3 border-t border-border" />

            <Link
              href="/sign-in"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full"
              )}
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              onClick={closeMenu}
              className={cn(
                buttonVariants(),
                "w-full"
              )}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
