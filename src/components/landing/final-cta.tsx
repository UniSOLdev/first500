import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tagline } from "@/components/brand/tagline";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT } from "@/config/product";
import { cn } from "@/lib/utils";

const SIGNUP_HREF = "/signup?next=/checkout";

export function FinalCta() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary/5 px-6 py-12 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to stop planning and start selling?
        </h2>
        <Tagline className="mt-4 flex flex-col items-center" />
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Join the challenge, follow the daily system, and build something real
          — one day at a time.
        </p>
        <Link
          href={SIGNUP_HREF}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 h-12 gap-2 px-8 text-base"
          )}
        >
          {PRODUCT.ctaPrimary}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
