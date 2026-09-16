import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tagline } from "@/components/brand/tagline";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT } from "@/config/product";
import { cn } from "@/lib/utils";

const SIGNUP_HREF = "/signup?next=/checkout";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {PRODUCT.descriptor}
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Work toward your first{" "}
              <span className="text-brand">$500</span> in booked revenue
            </h1>
            <Tagline />
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              A focused 7-day challenge that walks you through choosing a
              service, building an offer, pricing it, finding customers, and
              starting outreach — with scripts, templates, and an AI coach at
              every step.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={SIGNUP_HREF}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 px-6 text-base"
              )}
            >
              {PRODUCT.ctaPrimary}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-6 text-base"
              )}
            >
              See how it works
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            One-time {PRODUCT.displayPrice} · Lifetime access · Beginner-friendly
          </p>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
