"use client";

import { useState } from "react";
import type { ChallengeDay, DayDeliverables } from "@/content/challenge";
import type { DayStatus } from "@/types/database";
import { ChallengeDayLayout } from "@/components/challenge/challenge-day-layout";
import { Day1ServicePicker } from "@/components/challenge/day-1-service-picker";
import { Day2OfferBuilder } from "@/components/challenge/day-2-offer-builder";
import { Day3PricingBuilder } from "@/components/challenge/day-3-pricing-builder";
import { Day4BrandBuilder } from "@/components/challenge/day-4-brand-builder";
import { Day5ProspectList } from "@/components/challenge/day-5-prospect-list";
import { Day6Outreach } from "@/components/challenge/day-6-outreach";
import { Day7QuoteBuilder } from "@/components/challenge/day-7-quote-builder";
import {
  DayResponsesProvider,
  useDaySave,
} from "@/components/challenge/use-day-save";

type DayChallengeClientProps = {
  day: ChallengeDay;
  status: DayStatus;
  responses: DayDeliverables;
  defaultService?: string;
  defaultOffer?: string;
};

export function DayChallengeClient(props: DayChallengeClientProps) {
  return (
    <DayResponsesProvider
      dayNumber={props.day.number}
      initialResponses={props.responses as Record<string, unknown>}
    >
      <DayChallengeInner {...props} />
    </DayResponsesProvider>
  );
}

function DayChallengeInner({
  day,
  status,
  responses,
  defaultService = "",
  defaultOffer = "",
}: DayChallengeClientProps) {
  const [canComplete, setCanComplete] = useState(status === "completed");
  const { getResponses } = useDaySave();
  const deliverableKey = day.deliverable.key;
  const isCompleted = status === "completed";

  const commonProps = {
    dayNumber: day.number,
    deliverableKey,
    onValidityChange: (valid: boolean) => {
      if (!isCompleted) setCanComplete(valid);
    },
  };

  function renderDeliverable() {
    switch (day.number) {
      case 1:
        return (
          <Day1ServicePicker
            {...commonProps}
            initialData={responses.selectedService}
          />
        );
      case 2:
        return (
          <Day2OfferBuilder
            {...commonProps}
            initialData={responses.coreOffer}
            defaultService={defaultService}
          />
        );
      case 3:
        return (
          <Day3PricingBuilder
            {...commonProps}
            initialData={responses.pricingTiers}
          />
        );
      case 4:
        return (
          <Day4BrandBuilder
            {...commonProps}
            initialData={responses.businessProfile}
            defaultOffer={defaultOffer}
          />
        );
      case 5:
        return (
          <Day5ProspectList
            {...commonProps}
            initialData={responses.prospectList}
          />
        );
      case 6:
        return (
          <Day6Outreach
            {...commonProps}
            initialData={responses.firstOutreach}
          />
        );
      case 7:
        return (
          <Day7QuoteBuilder
            {...commonProps}
            initialData={responses.closingSystem}
            defaultService={defaultService}
          />
        );
      default:
        return null;
    }
  }

  return (
    <ChallengeDayLayout
      day={day}
      status={status}
      getResponses={getResponses}
      canComplete={canComplete || isCompleted}
      completeDisabledReason={
        canComplete || isCompleted
          ? undefined
          : "Complete the deliverable above before marking this day done."
      }
    >
      {renderDeliverable()}
    </ChallengeDayLayout>
  );
}
