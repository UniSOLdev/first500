/**
 * Shared integration contracts — do not break without coordinating all agents.
 */

import type { DayStatus } from "@/types/database";

export type DashboardData = {
  firstName: string;
  currentDay: number;
  completedCount: number;
  totalDays: number;
  dayStates: Record<number, DayStatus>;
  momentumMessage: string | null;
  onboardingCompleted: boolean;
  devBypassActive: boolean;
};

export type CoachContext = {
  service?: string | null;
  cityOrMarket?: string | null;
  budget?: string | null;
  experience?: string | null;
  hours?: string | null;
  goal?: string | null;
  currentDay?: number;
  deliverables?: Record<string, unknown>;
};

export type EntitlementStatusResponse = {
  active: boolean;
  purchasedAt?: string | null;
};

export const ALLOWED_REDIRECTS = [
  "/checkout",
  "/dashboard",
  "/onboarding",
  "/settings",
  "/resources",
] as const;
