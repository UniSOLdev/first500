import { AppShell } from "@/components/layout/app-shell";
import { CoachProvider } from "@/components/coach";
import { requireEntitlement } from "@/lib/auth/server";
import {
  getChallengeProfile,
  getProgress,
} from "@/lib/challenge/queries";
import { computeDayStates, getCurrentDay } from "@/lib/challenge/progress";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireEntitlement();

  const [profile, progressRows] = await Promise.all([
    getChallengeProfile(user.id),
    getProgress(user.id),
  ]);

  const dayStates = computeDayStates(progressRows);
  const currentDay = getCurrentDay(dayStates);

  const deliverables: Record<string, unknown> = {};
  for (const row of progressRows) {
    if (row.responses && typeof row.responses === "object") {
      Object.assign(deliverables, row.responses as Record<string, unknown>);
    }
  }

  const initialContext = {
    service: profile?.selected_service,
    cityOrMarket: profile?.city_or_market,
    budget: profile?.starting_budget,
    experience: profile?.experience_level,
    hours: profile?.available_hours,
    goal: profile?.primary_goal,
    currentDay,
    deliverables,
  };

  return (
    <CoachProvider initialContext={initialContext}>
      <AppShell>{children}</AppShell>
    </CoachProvider>
  );
}
