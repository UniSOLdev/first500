import { createAdminClient } from "@/lib/supabase/admin";

export type AnalyticsEvent =
  | "landing_view"
  | "cta_click"
  | "signup_started"
  | "signup_completed"
  | "checkout_started"
  | "purchase_completed"
  | "dashboard_view"
  | "day_1_started"
  | "day_completed"
  | "challenge_completed"
  | "ai_coach_used"
  // Legacy aliases kept for compatibility
  | "landing_page_view"
  | "checkout_completed"
  | "onboarding_completed"
  | "challenge_day_started"
  | "challenge_day_completed";

export type PublicAnalyticsEvent = Extract<
  AnalyticsEvent,
  | "landing_view"
  | "cta_click"
  | "signup_started"
  | "dashboard_view"
  | "day_1_started"
>;

const EVENT_ALIASES: Partial<Record<AnalyticsEvent, AnalyticsEvent>> = {
  landing_page_view: "landing_view",
  checkout_completed: "purchase_completed",
  onboarding_completed: "dashboard_view",
  challenge_day_started: "day_1_started",
  challenge_day_completed: "day_completed",
};

function normalizeEvent(event: AnalyticsEvent): AnalyticsEvent {
  return EVENT_ALIASES[event] ?? event;
}

async function persistEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
  userId?: string | null
) {
  try {
    const admin = createAdminClient();
    await admin.from("analytics_events").insert({
      event_name: normalizeEvent(event),
      user_id: userId ?? null,
      properties: properties ?? {},
    });
  } catch (error) {
    // Never block user flows for analytics
    console.debug("[analytics] persist skipped:", error);
  }
}

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
) {
  const normalized = normalizeEvent(event);

  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER) {
      console.debug("[analytics]", normalized, properties);
    }

    // Fire-and-forget to internal endpoint
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: normalized, properties }),
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackServer(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
  userId?: string | null
) {
  const normalized = normalizeEvent(event);

  if (process.env.ANALYTICS_PROVIDER || process.env.NODE_ENV === "production") {
    console.debug("[analytics:server]", normalized, properties);
  }

  void persistEvent(normalized, properties, userId);
}

export function trackCtaClick(source: string) {
  track("cta_click", { source });
}
