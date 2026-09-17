import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { DayTimeline } from "@/components/challenge/day-timeline";
import { ProgressRing } from "@/components/challenge/progress-ring";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CHALLENGE_DAYS, TOTAL_DAYS } from "@/content/challenge";
import {
  getProfile,
  isDevBypassEntitlement,
  requireEntitlement,
} from "@/lib/auth/server";
import {
  computeDayStates,
  countCompletedDays,
  getCurrentDay,
  getMomentumMessage,
} from "@/lib/challenge/progress";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics";

export default async function DashboardPage() {
  const user = await requireEntitlement();
  const supabase = await createClient();

  const [profile, progressResult, challengeProfileResult] = await Promise.all([
    getProfile(user.id),
    supabase
      .from("challenge_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("day_number"),
    supabase
      .from("challenge_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const progressRows = progressResult.data ?? [];
  const dayStates = computeDayStates(progressRows);
  const currentDay = getCurrentDay(dayStates);
  const completedCount = countCompletedDays(dayStates);
  const momentumMessage = getMomentumMessage(completedCount);
  const devBypassActive = isDevBypassEntitlement();

  const firstName =
    profile?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  const today = CHALLENGE_DAYS.find((d) => d.number === currentDay)!;
  const progressPercent = Math.round((completedCount / TOTAL_DAYS) * 100);

  const timelineDays = CHALLENGE_DAYS.map((day) => ({
    number: day.number,
    slug: day.slug,
    title: day.title,
    status: dayStates[day.number] ?? "locked",
  }));

  const todayStatus = dayStates[currentDay];
  const missionCta =
    todayStatus === "completed"
      ? "Review day"
      : todayStatus === "in_progress"
        ? "Continue mission"
        : "Start today's mission";

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <DashboardAnalytics />
      {devBypassActive && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>Dev bypass active.</strong> Entitlement check is bypassed
            via DEV_BYPASS_ENTITLEMENT. Do not use in production.
          </p>
        </div>
      )}

      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Welcome back, {firstName}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Day {currentDay} of {TOTAL_DAYS}
            </h1>
            {momentumMessage && (
              <p className="mt-1 text-sm text-primary">{momentumMessage}</p>
            )}
          </div>
          <ProgressRing completed={completedCount} total={TOTAL_DAYS} size={88} strokeWidth={6} />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Challenge progress</span>
            <span className="text-muted-foreground tabular-nums">
              {completedCount}/{TOTAL_DAYS} days
            </span>
          </div>
          <Progress value={progressPercent} />
        </div>
      </header>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="border-b border-primary/10 bg-primary/5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="uppercase tracking-wide">Today&apos;s Mission</Badge>
            <Badge variant="outline">{today.estimatedTime}</Badge>
          </div>
          <CardTitle className="text-xl">{today.title}</CardTitle>
          <CardDescription>{today.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {today.objective}
          </p>
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
            <span className="font-medium text-foreground">Deliverable: </span>
            <span className="text-muted-foreground">{today.deliverable.label}</span>
          </div>
          <Link
            href={`/challenge/${today.slug}`}
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            {missionCta}
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>

      <section id="journey" className="scroll-mt-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your 7-day journey</h2>
            <p className="text-sm text-muted-foreground">
              Complete each day to unlock the next.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <DayTimeline days={timelineDays} />
          </CardContent>
        </Card>
      </section>

      {!challengeProfileResult.data?.onboarding_completed && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Complete your profile setup</p>
              <p className="text-sm text-muted-foreground">
                Tell us about your service and market so the AI coach can help
                you better.
              </p>
            </div>
            <Link href="/onboarding" className={buttonVariants({ variant: "outline" })}>
              Finish setup
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
