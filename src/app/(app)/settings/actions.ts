"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server";

const settingsSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  selectedService: z.string().optional(),
  cityOrMarket: z.string().optional(),
  startingBudget: z.string().optional(),
  availableHours: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export type SettingsResult = {
  error?: string;
  success?: boolean;
};

export async function updateSettings(
  data: SettingsInput
): Promise<SettingsResult> {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireAuth();
  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  const { error: challengeError } = await supabase
    .from("challenge_profiles")
    .upsert(
      {
        user_id: user.id,
        selected_service: parsed.data.selectedService || null,
        city_or_market: parsed.data.cityOrMarket || null,
        starting_budget: parsed.data.startingBudget || null,
        available_hours: parsed.data.availableHours || null,
      },
      { onConflict: "user_id" }
    );

  if (challengeError) {
    return { error: challengeError.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
