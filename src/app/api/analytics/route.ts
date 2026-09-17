import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { trackServer, type AnalyticsEvent } from "@/lib/analytics";

const bodySchema = z.object({
  event: z.string(),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const ALLOWED_CLIENT_EVENTS = new Set<string>([
  "landing_view",
  "cta_click",
  "signup_started",
  "dashboard_view",
  "day_1_started",
]);

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());

    if (!ALLOWED_CLIENT_EVENTS.has(body.event)) {
      return NextResponse.json({ ok: true });
    }

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Anonymous events are fine
    }

    trackServer(body.event as AnalyticsEvent, body.properties, userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
