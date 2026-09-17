"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";
import type { DayStatus, Json } from "@/types/database";
import { TOTAL_DAYS } from "@/content/challenge";
import { trackServer } from "@/lib/analytics";

const onboardingSchema = z.object({
  selectedService: z.string().min(1, "Select a service"),
  startingBudget: z.string().min(1, "Select a budget"),
  experienceLevel: z.string().min(1, "Select your experience level"),
  availableHours: z.string().min(1, "Select available hours"),
  cityOrMarket: z.string().min(1, "Enter your city or market"),
  primaryGoal: z.string().min(1, "Select your primary goal"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function saveOnboarding(
  data: OnboardingInput
): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("challenge_profiles").upsert(
    {
      user_id: user.id,
      selected_service: parsed.data.selectedService,
      starting_budget: parsed.data.startingBudget,
      experience_level: parsed.data.experienceLevel,
      available_hours: parsed.data.availableHours,
      city_or_market: parsed.data.cityOrMarket,
      primary_goal: parsed.data.primaryGoal,
      onboarding_completed: true,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}

export async function startDay(dayNumber: number): Promise<ActionResult> {
  const user = await requireAuth();
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return { error: "Invalid day number" };
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("challenge_progress").upsert(
    {
      user_id: user.id,
      day_number: dayNumber,
      status: "in_progress" as DayStatus,
      started_at: now,
    },
    { onConflict: "user_id,day_number" }
  );

  if (error) return { error: error.message };

  if (dayNumber === 1) {
    trackServer("day_1_started", { day_number: dayNumber }, user.id);
  } else {
    trackServer("challenge_day_started", { day_number: dayNumber }, user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/challenge/day-${dayNumber}`);
  return { success: true };
}

export async function saveDayProgress(
  dayNumber: number,
  responses: Record<string, unknown>,
  status: DayStatus = "in_progress"
): Promise<ActionResult> {
  const user = await requireAuth();
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return { error: "Invalid day number" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("challenge_progress").upsert(
    {
      user_id: user.id,
      day_number: dayNumber,
      status,
      responses: responses as Json,
    },
    { onConflict: "user_id,day_number" }
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/challenge/day-${dayNumber}`);
  return { success: true };
}

export async function completeDay(
  dayNumber: number,
  responses: Record<string, unknown> = {}
): Promise<ActionResult> {
  const user = await requireAuth();
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return { error: "Invalid day number" };
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { error: completeError } = await supabase
    .from("challenge_progress")
    .upsert(
      {
        user_id: user.id,
        day_number: dayNumber,
        status: "completed" as DayStatus,
        responses: responses as Json,
        completed_at: now,
      },
      { onConflict: "user_id,day_number" }
    );

  if (completeError) return { error: completeError.message };

  trackServer("day_completed", { day_number: dayNumber }, user.id);
  if (dayNumber === TOTAL_DAYS) {
    trackServer("challenge_completed", {}, user.id);
  }

  if (dayNumber < TOTAL_DAYS) {
    const { data: nextDay } = await supabase
      .from("challenge_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("day_number", dayNumber + 1)
      .maybeSingle();

    if (!nextDay || nextDay.status === "locked") {
      await supabase.from("challenge_progress").upsert(
        {
          user_id: user.id,
          day_number: dayNumber + 1,
          status: "available" as DayStatus,
        },
        { onConflict: "user_id,day_number" }
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/challenge/day-${dayNumber}`);
  if (dayNumber < TOTAL_DAYS) {
    revalidatePath(`/challenge/day-${dayNumber + 1}`);
  }
  return { success: true };
}
