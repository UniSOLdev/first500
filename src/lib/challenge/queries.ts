import { createClient } from "@/lib/supabase/server";
import {
  isDevBypassEntitlement,
  getProfile,
  requireAuth,
} from "@/lib/auth/server";
import {
  computeDayStates,
  countCompletedDays,
  getCurrentDay,
  getMomentumMessage,
} from "@/lib/challenge/progress";
import type { DashboardData } from "@/lib/integration/contracts";
import { TOTAL_DAYS } from "@/content/challenge";
import type { ChallengeProfile, ChallengeProgress } from "@/types/database";

export async function getChallengeProfile(
  userId: string
): Promise<ChallengeProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("challenge_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function getProgress(userId: string): Promise<ChallengeProgress[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", userId)
    .order("day_number", { ascending: true });

  return data ?? [];
}

/** Authenticated fetch used by challenge day and complete pages */
export async function getChallengeProgress(): Promise<ChallengeProgress[]> {
  const user = await requireAuth();
  return getProgress(user.id);
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const profile = await getChallengeProfile(userId);
  return profile?.onboarding_completed ?? false;
}

export async function initializeProgress(
  userId: string
): Promise<ChallengeProgress[]> {
  const existing = await getProgress(userId);
  if (existing.length > 0) return existing;

  const supabase = await createClient();
  const { error } = await supabase.from("challenge_progress").insert({
    user_id: userId,
    day_number: 1,
    status: "available",
  });

  if (error) throw error;

  return getProgress(userId);
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [profile, challengeProfile, progressRows] = await Promise.all([
    getProfile(userId),
    getChallengeProfile(userId),
    getProgress(userId),
  ]);

  const progress =
    progressRows.length === 0
      ? await initializeProgress(userId)
      : progressRows;

  const dayStates = computeDayStates(progress);
  const completedCount = countCompletedDays(dayStates);

  const firstName =
    profile?.full_name?.split(" ")[0]?.trim() ||
    profile?.email?.split("@")[0] ||
    "there";

  return {
    firstName,
    currentDay: getCurrentDay(dayStates),
    completedCount,
    totalDays: TOTAL_DAYS,
    dayStates,
    momentumMessage: getMomentumMessage(completedCount),
    onboardingCompleted: challengeProfile?.onboarding_completed ?? false,
    devBypassActive: isDevBypassEntitlement(),
  };
}
