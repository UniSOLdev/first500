"use client";

import { useEffect, useMemo, useState } from "react";
import type { PricingTier, PricingTiersDeliverable } from "@/content/challenge";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Day3PricingBuilderProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: PricingTiersDeliverable;
  onValidityChange?: (valid: boolean) => void;
};

function defaultTiers(baseCost: number): PricingTier[] {
  return [
    {
      name: "Starter",
      price: Math.round(baseCost * 0.85),
      includes: "Essential service — gets the job done well",
    },
    {
      name: "Standard",
      price: Math.round(baseCost),
      includes: "Most popular — full scope with quality finish",
    },
    {
      name: "Premium",
      price: Math.round(baseCost * 1.35),
      includes: "Best result — extras, priority scheduling, or upgrades",
    },
  ];
}

const DEFAULT_INPUTS = {
  laborHours: 2,
  suppliesCost: 25,
  travelCost: 15,
  hourlyValue: 50,
};

function calculateBase(vals: typeof DEFAULT_INPUTS) {
  return (
    vals.laborHours * vals.hourlyValue + vals.suppliesCost + vals.travelCost
  );
}

export function Day3PricingBuilder({
  deliverableKey,
  initialData,
  onValidityChange,
}: Day3PricingBuilderProps) {
  const { savePartial } = useDaySave();
  const [inputs, setInputs] = useState({
    laborHours: initialData?.laborHours ?? DEFAULT_INPUTS.laborHours,
    suppliesCost: initialData?.suppliesCost ?? DEFAULT_INPUTS.suppliesCost,
    travelCost: initialData?.travelCost ?? DEFAULT_INPUTS.travelCost,
    hourlyValue: initialData?.hourlyValue ?? DEFAULT_INPUTS.hourlyValue,
  });
  const [manualTiers, setManualTiers] = useState<PricingTier[] | null>(
    initialData?.tiers ?? null
  );

  const suggestedBase = useMemo(() => calculateBase(inputs), [inputs]);
  const tiers = manualTiers ?? defaultTiers(suggestedBase);

  useEffect(() => {
    const data: PricingTiersDeliverable = { ...inputs, tiers };
    const valid = tiers.every((t) => t.price > 0 && t.name.trim());
    onValidityChange?.(valid);
    savePartial({ [deliverableKey]: data });
  }, [inputs, tiers, deliverableKey, savePartial, onValidityChange]);

  function updateInput(key: keyof typeof inputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setManualTiers(null);
  }

  function updateTier(index: number, patch: Partial<PricingTier>) {
    const base = manualTiers ?? defaultTiers(suggestedBase);
    setManualTiers(
      base.map((tier, i) => (i === index ? { ...tier, ...patch } : tier))
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="laborHours">Labor hours (per job)</Label>
          <Input
            id="laborHours"
            type="number"
            min={0.5}
            step={0.5}
            value={inputs.laborHours}
            onChange={(e) => updateInput("laborHours", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyValue">Your hourly value ($)</Label>
          <Input
            id="hourlyValue"
            type="number"
            min={1}
            value={inputs.hourlyValue}
            onChange={(e) => updateInput("hourlyValue", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suppliesCost">Supplies cost ($)</Label>
          <Input
            id="suppliesCost"
            type="number"
            min={0}
            value={inputs.suppliesCost}
            onChange={(e) =>
              updateInput("suppliesCost", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelCost">Travel cost ($)</Label>
          <Input
            id="travelCost"
            type="number"
            min={0}
            value={inputs.travelCost}
            onChange={(e) => updateInput("travelCost", Number(e.target.value))}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Suggested base price:{" "}
        <span className="font-medium text-foreground">
          ${Math.round(suggestedBase)}
        </span>{" "}
        (labor + supplies + travel). Adjust tiers below for your market.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <Card key={tier.name} size="sm">
            <CardHeader>
              <CardTitle className="text-base">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`tier-price-${index}`}>Price ($)</Label>
                <Input
                  id={`tier-price-${index}`}
                  type="number"
                  min={1}
                  value={tier.price}
                  onChange={(e) =>
                    updateTier(index, { price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tier-includes-${index}`}>Includes</Label>
                <Textarea
                  id={`tier-includes-${index}`}
                  value={tier.includes}
                  onChange={(e) =>
                    updateTier(index, { includes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
