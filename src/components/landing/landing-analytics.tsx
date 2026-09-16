"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function LandingAnalytics() {
  useEffect(() => {
    track("landing_page_view");
  }, []);

  return null;
}
