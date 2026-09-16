import { notFound } from "next/navigation";
import type { DayDeliverables } from "@/content/challenge";
import { CHALLENGE_DAYS } from "@/content/challenge";
import { startDay } from "@/app/(app)/challenge/actions";
import { computeDayStates, getDayBySlug } from "@/lib/challenge/progress";
import {
  getChallengeProgress,
  initializeProgress,
} from "@/lib/challenge/queries";
import { requireEntitlement } from "@/lib/auth/server";
import { LockedDayScreen } from "@/components/challenge/challenge-day-layout";
import { DayChallengeClient } from "./day-challenge-client";
import type { Json } from "@/types/database";

type PageProps = {
  params: Promise<{ day: string }>;
};

function parseResponses(raw: Json | undefined): DayDeliverables {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as DayDeliverables;
}

function getServiceName(deliverables: DayDeliverables[]): string {
  for (const d of deliverables) {
    if (d.selectedService?.serviceName) return d.selectedService.serviceName;
  }
  return "";
}

function getOfferStatement(deliverables: DayDeliverables[]): string {
  for (const d of deliverables) {
    if (d.coreOffer?.offerStatement) return d.coreOffer.offerStatement;
  }
  return "";
}

export function generateStaticParams() {
  return CHALLENGE_DAYS.map((day) => ({ day: day.slug }));
}

export default async function ChallengeDayPage({ params }: PageProps) {
  const user = await requireEntitlement();
  const { day: slug } = await params;
  const day = getDayBySlug(slug);

  if (!day) {
    notFound();
  }

  let progressRows = await getChallengeProgress();
  if (progressRows.length === 0) {
    progressRows = await initializeProgress(user.id);
  }
  const dayStates = computeDayStates(progressRows);
  const status = dayStates[day.number] ?? "locked";

  if (status === "locked") {
    return <LockedDayScreen day={day} />;
  }

  if (status === "available") {
    await startDay(day.number);
  }

  const currentRow = progressRows.find((p) => p.day_number === day.number);
  const responses = parseResponses(currentRow?.responses);

  const allDeliverables = progressRows.map((row) =>
    parseResponses(row.responses)
  );
  const defaultService = getServiceName(allDeliverables);
  const defaultOffer = getOfferStatement(allDeliverables);

  if (day.number === 1 && !defaultService && status !== "completed") {
    // Day 1 is entry point — no redirect needed
  }

  return (
    <DayChallengeClient
      day={day}
      status={status === "available" ? "in_progress" : status}
      responses={responses}
      defaultService={defaultService}
      defaultOffer={defaultOffer}
    />
  );
}
