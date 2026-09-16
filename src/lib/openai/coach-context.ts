import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoachContext } from "@/lib/integration/contracts";
import type {
  ChallengeProfile,
  ChallengeProgress,
  Database,
} from "@/types/database";
import {
  computeDayStates,
  getCurrentDay,
} from "@/lib/challenge/progress";

type ProfileFields = Pick<
  ChallengeProfile,
  | "selected_service"
  | "city_or_market"
  | "starting_budget"
  | "experience_level"
  | "available_hours"
  | "primary_goal"
>;

type ProgressFields = Pick<
  ChallengeProgress,
  "day_number" | "status" | "responses"
>;

export async function loadCoachContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  dayNumber?: number
): Promise<CoachContext> {
  const [profileResult, progressResult] = await Promise.all([
    supabase
      .from("challenge_profiles")
      .select(
        "selected_service, city_or_market, starting_budget, experience_level, available_hours, primary_goal"
      )
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("challenge_progress")
      .select("day_number, status, responses")
      .eq("user_id", userId)
      .order("day_number", { ascending: true }),
  ]);

  const profile = profileResult.data as ProfileFields | null;
  const progressRows = (progressResult.data ?? []) as ProgressFields[];

  const deliverables: Record<string, unknown> = {};
  for (const row of progressRows ?? []) {
    if (
      row.responses &&
      typeof row.responses === "object" &&
      !Array.isArray(row.responses)
    ) {
      Object.assign(deliverables, row.responses as Record<string, unknown>);
    }
  }

  const dayStates = computeDayStates(progressRows as ChallengeProgress[]);
  const currentDay = dayNumber ?? getCurrentDay(dayStates);

  return {
    service: profile?.selected_service ?? null,
    cityOrMarket: profile?.city_or_market ?? null,
    budget: profile?.starting_budget ?? null,
    experience: profile?.experience_level ?? null,
    hours: profile?.available_hours ?? null,
    goal: profile?.primary_goal ?? null,
    currentDay,
    deliverables,
  };
}

export function buildCoachContextString(context: CoachContext): string {
  const lines: string[] = ["## User context"];

  if (context.service) lines.push(`- Service: ${context.service}`);
  if (context.cityOrMarket) lines.push(`- Market: ${context.cityOrMarket}`);
  if (context.budget) lines.push(`- Starting budget: ${context.budget}`);
  if (context.experience) lines.push(`- Experience: ${context.experience}`);
  if (context.hours) lines.push(`- Available hours: ${context.hours}`);
  if (context.goal) lines.push(`- Primary goal: ${context.goal}`);
  if (context.currentDay) {
    lines.push(`- Current challenge day: ${context.currentDay}`);
  }

  const deliverableEntries = Object.entries(context.deliverables ?? {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  if (deliverableEntries.length > 0) {
    lines.push("", "## Challenge work so far");
    for (const [key, value] of deliverableEntries) {
      const formatted =
        typeof value === "string" ? value : JSON.stringify(value, null, 2);
      lines.push(`- ${key}: ${formatted}`);
    }
  }

  if (lines.length === 1) {
    lines.push("- No onboarding or challenge data saved yet.");
  }

  return lines.join("\n");
}
