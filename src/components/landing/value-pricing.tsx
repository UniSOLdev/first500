import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRODUCT } from "@/config/product";
import { cn } from "@/lib/utils";

const SIGNUP_HREF = "/signup?next=/checkout";

const INCLUDED = [
  "Full 7-day challenge with daily lessons and tasks",
  "Personal dashboard with saved deliverables",
  "Offer, pricing, and outreach builders",
  "Copy-paste scripts and templates",
  "AI coach for guidance when you're stuck",
  "Resource library with lifetime access",
] as const;

export function ValuePricing() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One price. Everything included.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No upsells. No monthly fees. Pay once and keep access forever.
          </p>
        </div>

        <Card className="mx-auto mt-12 max-w-lg overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-border/60 bg-primary/5 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {PRODUCT.name}
            </p>
            <CardTitle className="mt-2 text-5xl font-bold tracking-tight">
              {PRODUCT.displayPrice}
            </CardTitle>
            <p className="text-sm text-muted-foreground">One-time payment</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={SIGNUP_HREF}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full gap-2 text-base"
              )}
            >
              {PRODUCT.ctaPrimary}
              <ArrowRight className="size-4" />
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Secure checkout · Instant access after purchase
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
