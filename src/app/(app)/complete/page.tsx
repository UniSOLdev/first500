import Link from "next/link";
import { CheckCircle2Icon, PartyPopperIcon } from "lucide-react";
import {
  CHALLENGE_DAYS,
  type DayDeliverables,
} from "@/content/challenge";
import {
  getChallengeProgress,
  initializeProgress,
} from "@/lib/challenge/queries";
import { computeDayStates, countCompletedDays } from "@/lib/challenge/progress";
import { requireEntitlement } from "@/lib/auth/server";
import { CopyButton } from "@/components/challenge/copy-button";
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
import type { Json } from "@/types/database";

function parseResponses(raw: Json | undefined): DayDeliverables {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as DayDeliverables;
}

function DeliverableSummary({
  dayNumber,
  deliverables,
}: {
  dayNumber: number;
  deliverables: DayDeliverables;
}) {
  const day = CHALLENGE_DAYS.find((d) => d.number === dayNumber);
  if (!day) return null;

  const key = day.deliverable.key as keyof DayDeliverables;
  const data = deliverables[key];

  if (!data) {
    return (
      <Card size="sm" className="opacity-60">
        <CardHeader>
          <CardTitle className="text-sm">
            Day {dayNumber}: {day.deliverable.label}
          </CardTitle>
          <CardDescription>Not saved yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  let summary: React.ReactNode = null;
  let copyText = "";

  switch (dayNumber) {
    case 1: {
      const d = deliverables.selectedService!;
      summary = <p className="text-sm">{d.serviceName}</p>;
      copyText = d.serviceName;
      break;
    }
    case 2: {
      const d = deliverables.coreOffer!;
      summary = <p className="text-sm">{d.offerStatement}</p>;
      copyText = d.offerStatement;
      break;
    }
    case 3: {
      const d = deliverables.pricingTiers!;
      summary = (
        <ul className="space-y-1 text-sm">
          {d.tiers.map((tier) => (
            <li key={tier.name}>
              <span className="font-medium">{tier.name}:</span> ${tier.price} —{" "}
              {tier.includes}
            </li>
          ))}
        </ul>
      );
      copyText = d.tiers
        .map((t) => `${t.name}: $${t.price} — ${t.includes}`)
        .join("\n");
      break;
    }
    case 4: {
      const d = deliverables.businessProfile!;
      summary = (
        <div className="space-y-1 text-sm">
          <p className="font-medium">{d.businessName}</p>
          <p className="text-muted-foreground">{d.shortDescription}</p>
          <p>{d.contactPhone || d.contactEmail}</p>
        </div>
      );
      copyText = [d.businessName, d.shortDescription, d.facebookBio].join("\n\n");
      break;
    }
    case 5: {
      const d = deliverables.prospectList!;
      summary = (
        <p className="text-sm">
          {d.prospects.length} prospects tracked
        </p>
      );
      copyText = d.prospects
        .map((p) => `${p.name} — ${p.channel} — ${p.status}`)
        .join("\n");
      break;
    }
    case 6: {
      const d = deliverables.firstOutreach!;
      const done = d.actions.filter((a) => a.completed).length;
      summary = (
        <p className="text-sm">
          {done} outreach actions completed
        </p>
      );
      copyText = d.actions
        .filter((a) => a.completed)
        .map((a) => `${a.type}: ${a.target}`)
        .join("\n");
      break;
    }
    case 7: {
      const d = deliverables.closingSystem!;
      summary = <p className="text-sm whitespace-pre-wrap">{d.quoteText}</p>;
      copyText = d.quoteText;
      break;
    }
  }

  return (
    <Card size="sm">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-sm">
            Day {dayNumber}: {day.deliverable.label}
          </CardTitle>
          <CardDescription>{day.title}</CardDescription>
        </div>
        {copyText && <CopyButton text={copyText} />}
      </CardHeader>
      <CardContent>{summary}</CardContent>
    </Card>
  );
}

export default async function CompletePage() {
  const user = await requireEntitlement();

  let progressRows = await getChallengeProgress();
  if (progressRows.length === 0) {
    progressRows = await initializeProgress(user.id);
  }
  const dayStates = computeDayStates(progressRows);
  const completedCount = countCompletedDays(dayStates);
  const allComplete = completedCount === 7;

  const deliverablesByDay = CHALLENGE_DAYS.map((day) => {
    const row = progressRows.find((p) => p.day_number === day.number);
    return {
      dayNumber: day.number,
      deliverables: parseResponses(row?.responses),
      completed: dayStates[day.number] === "completed",
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="space-y-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          {allComplete ? (
            <PartyPopperIcon className="size-8 text-primary" />
          ) : (
            <CheckCircle2Icon className="size-8 text-primary" />
          )}
        </div>
        <div className="space-y-2">
          <Badge variant="secondary">
            {completedCount} of 7 days complete
          </Badge>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {allComplete
              ? "Challenge complete — your system is built"
              : "Your challenge progress"}
          </h1>
          <p className="text-muted-foreground">
            {allComplete
              ? "You have a real offer, pricing, brand, prospect list, outreach plan, and closing system. The work now is execution — go get customers."
              : "Review what you've built so far. Finish remaining days to complete your full customer-acquisition system."}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/dashboard" />}>
          Keep Building
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<Link href="/challenge/day-1" />}
        >
          Review Challenge
        </Button>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Your deliverables</h2>
        <div className="grid gap-3">
          {deliverablesByDay.map(({ dayNumber, deliverables }) => (
            <DeliverableSummary
              key={dayNumber}
              dayNumber={dayNumber}
              deliverables={deliverables}
            />
          ))}
        </div>
      </section>

      <Card className="border-muted bg-muted/30">
        <CardContent className="pt-4 text-center text-sm text-muted-foreground">
          FIRST $500 is a system-building challenge — not a guarantee of earnings.
          Results depend on your market, effort, and follow-through.
        </CardContent>
      </Card>
    </div>
  );
}
