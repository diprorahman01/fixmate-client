
import Link from "next/link";
import { Wrench } from "lucide-react";

type LogoProps = {
  href?: string;
  showText?: boolean;
};

export function Logo({
  href = "/",
  showText = true,
}: LogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5"
      aria-label="FixMate Home"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Wrench className="size-5" strokeWidth={2.5} />
      </span>

      {showText && (
        <span className="text-2xl font-extrabold tracking-tight">
          Fix<span className="text-primary">Mate</span>
        </span>
      )}
    </Link>
  );
}
