import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
export default function NotFound() {
  return <section className="flex min-h-[70vh] items-center justify-center px-4 py-20 text-center">
    <div className="max-w-xl"><SearchX className="mx-auto size-14 text-primary"/><p className="mt-5 text-7xl font-black">404</p><h1 className="mt-3 text-2xl font-bold">Page not found</h1><p className="mt-3 text-muted-foreground">We couldn't find the page you're looking for.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"><ArrowLeft className="size-4"/> Return Home</Link></div>
  </section>;
}
