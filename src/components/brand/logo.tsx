import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};

export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const sizes = {
    sm: { first: "text-sm", amount: "text-lg" },
    md: { first: "text-base", amount: "text-2xl" },
    lg: { first: "text-lg", amount: "text-4xl" },
  };

  const content = (
    <div className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-bold tracking-[0.2em] text-foreground",
          sizes[size].first
        )}
      >
        FIRST
      </span>
      <span
        className={cn(
          "font-bold tracking-tight text-brand",
          sizes[size].amount
        )}
      >
        $500
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
