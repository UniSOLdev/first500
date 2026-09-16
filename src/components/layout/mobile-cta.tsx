"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT } from "@/config/product";
import { cn } from "@/lib/utils";

const SIGNUP_HREF = "/signup?next=/checkout";

export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md md:hidden">
      <Link
        href={SIGNUP_HREF}
        className={cn(buttonVariants({ size: "lg" }), "h-12 w-full text-base")}
      >
        Start for {PRODUCT.displayPrice}
      </Link>
    </div>
  );
}
