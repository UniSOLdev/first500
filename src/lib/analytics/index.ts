export type AnalyticsEvent =
  | "landing_page_view"
  | "checkout_started"
  | "checkout_completed"
  | "signup_completed"
  | "onboarding_completed"
  | "challenge_day_started"
  | "challenge_day_completed"
  | "ai_coach_used"
  | "challenge_completed";

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined") {
    const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
    if (provider) {
      console.debug("[analytics]", event, properties);
    }
  }
}

export function trackServer(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
) {
  if (process.env.ANALYTICS_PROVIDER) {
    console.debug("[analytics:server]", event, properties);
  }
}
