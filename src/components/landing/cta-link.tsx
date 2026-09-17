"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackCtaClick } from "@/lib/analytics";

type CtaLinkProps = ComponentProps<typeof Link> & {
  source: string;
};

export function CtaLink({ source, onClick, ...props }: CtaLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackCtaClick(source);
        onClick?.(event);
      }}
    />
  );
}
