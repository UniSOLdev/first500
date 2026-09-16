"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowLeftIcon, CheckCircle2Icon, ClockIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import type { ChallengeDay } from "@/content/challenge";
import type { DayStatus } from "@/types/database";
import { completeDay } from "@/app/(app)/challenge/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ChallengeDayLayoutProps = {
  day: ChallengeDay;
  status: DayStatus;
  children: React.ReactNode;
  canComplete?: boolean;
  completeDisabledReason?: string;
  getResponses: () => Record<string, unknown>;
};

export function ChallengeDayLayout({
  day,
  status,
  children,
  canComplete = true,
  completeDisabledReason,
  getResponses,
}: ChallengeDayLayoutProps) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = status === "completed";

  function handleComplete() {
    if (!canComplete || isCompleted) return;

    startTransition(async () => {
      const result = await completeDay(day.number, getResponses());
      if (result.success) {
        toast.success(day.completionMessage);
      } else {
        toast.error(result.error ?? "Could not complete this day");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
          <ArrowLeftIcon />
          Dashboard
        </Button>
        <Badge variant="secondary">Day {day.number} of 7</Badge>
        {isCompleted && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2Icon className="size-3" />
            Completed
          </Badge>
        )}
      </div>

      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {day.title}
        </h1>
        <p className="text-muted-foreground">{day.subtitle}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            {day.estimatedTime}
          </span>
          <span>{day.milestone}</span>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s objective</CardTitle>
          <CardDescription>{day.objective}</CardDescription>
        </CardHeader>
      </Card>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Lesson</h2>
        {day.lessonSections.map((section) => (
          <Card key={section.heading} size="sm">
            <CardHeader>
              <CardTitle>{section.heading}</CardTitle>
              <CardDescription className="text-foreground/80 leading-relaxed">
                {section.body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-medium">Tasks</h2>
        <Card size="sm">
          <CardContent className="space-y-2 pt-0">
            <ul className="space-y-2">
              {day.tasks.map((task) => (
                <li key={task} className="flex items-start gap-2 text-sm">
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-3">
        <div>
          <h2 className="font-heading text-lg font-medium">
            {day.deliverable.label}
          </h2>
          <p className="text-sm text-muted-foreground">
            {day.deliverable.description}
          </p>
        </div>
        {children}
      </section>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              {isCompleted ? "Day complete" : "Ready to finish this day?"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isCompleted
                ? day.completionMessage
                : completeDisabledReason ??
                  "Save your work above, then mark this day complete."}
            </p>
          </div>
          <Button
            size="lg"
            disabled={isCompleted || !canComplete || isPending}
            onClick={handleComplete}
          >
            {isPending ? "Saving…" : isCompleted ? "Completed" : "Complete Day"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function LockedDayScreen({ day }: { day: ChallengeDay }) {
  const prevSlug = day.number > 1 ? `day-${day.number - 1}` : null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <LockIcon className="size-6 text-muted-foreground" />
      </div>
      <h1 className="font-heading text-xl font-semibold">Day {day.number} is locked</h1>
      <p className="text-muted-foreground">
        Complete {prevSlug ? `Day ${day.number - 1}` : "onboarding"} first to unlock{" "}
        <span className="font-medium text-foreground">{day.title}</span>.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Back to dashboard
        </Button>
        {prevSlug && (
          <Button render={<Link href={`/challenge/${prevSlug}`} />}>
            Go to Day {day.number - 1}
          </Button>
        )}
      </div>
    </div>
  );
}
