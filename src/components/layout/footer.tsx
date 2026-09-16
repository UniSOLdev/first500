import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Tagline } from "@/components/brand/tagline";
import { PRODUCT } from "@/config/product";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Logo href="/" size="sm" />
            <Tagline showDescriptor={false} />
            <p className="max-w-sm text-sm text-muted-foreground">
              {PRODUCT.descriptor} — a practical system to help you build and
              sell a local service, one day at a time.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#how-it-works" className="hover:text-foreground">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#what-you-get" className="hover:text-foreground">
                  What You Get
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-foreground">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} FIRST $500. All rights reserved.</p>
          <p>
            Results vary. No earnings are guaranteed. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
