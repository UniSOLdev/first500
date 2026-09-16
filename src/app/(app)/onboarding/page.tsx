import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/server";
import { getChallengeProfile } from "@/lib/challenge/queries";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function OnboardingPage() {
  const user = await requireAuth();
  const profile = await getChallengeProfile(user.id);

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingWizard
        initialData={
          profile
            ? {
                selectedService: profile.selected_service ?? "",
                startingBudget: profile.starting_budget ?? "",
                experienceLevel: profile.experience_level ?? "",
                availableHours: profile.available_hours ?? "",
                cityOrMarket: profile.city_or_market ?? "",
                primaryGoal: profile.primary_goal ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
