"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function DashboardAnalytics() {
  useEffect(() => {
    track("dashboard_view");
  }, []);

  return null;
}
