"use client";

import { useState, useTransition } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ONBOARDING_SERVICES } from "@/content/challenge";
import { saveOnboarding, type OnboardingInput } from "@/app/(app)/challenge/actions";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS = [
  "Under $100",
  "$100 – $300",
  "$300 – $500",
  "$500+",
];

const EXPERIENCE_OPTIONS = [
  "Complete beginner",
  "Some experience",
  "Experienced side hustler",
];

const HOURS_OPTIONS = [
  "1–5 hrs/week",
  "5–10 hrs/week",
  "10–20 hrs/week",
  "20+ hrs/week",
];

const GOAL_OPTIONS = [
  "Make my first $500",
  "Build a side income",
  "Replace my job income",
  "Test if this is for me",
];

const STEPS = [
  { title: "Choose a service", description: "What local service will you focus on?" },
  { title: "Starting budget", description: "How much can you invest to get started?" },
  { title: "Experience level", description: "Where are you starting from?" },
  { title: "Available time", description: "How many hours can you commit each week?" },
  { title: "Your market", description: "Where will you find customers?" },
  { title: "Primary goal", description: "What does success look like for you?" },
];

type OnboardingWizardProps = {
  initialData?: Partial<OnboardingInput>;
};

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<OnboardingInput>({
    selectedService: initialData?.selectedService ?? "",
    startingBudget: initialData?.startingBudget ?? "",
    experienceLevel: initialData?.experienceLevel ?? "",
    availableHours: initialData?.availableHours ?? "",
    cityOrMarket: initialData?.cityOrMarket ?? "",
    primaryGoal: initialData?.primaryGoal ?? "",
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  function updateField<K extends keyof OnboardingInput>(
    key: K,
    value: OnboardingInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function validateStep(): boolean {
    switch (step) {
      case 0:
        if (!form.selectedService) {
          setError("Select a service to continue");
          return false;
        }
        return true;
      case 1:
        if (!form.startingBudget) {
          setError("Select a budget to continue");
          return false;
        }
        return true;
      case 2:
        if (!form.experienceLevel) {
          setError("Select your experience level");
          return false;
        }
        return true;
      case 3:
        if (!form.availableHours) {
          setError("Select your available hours");
          return false;
        }
        return true;
      case 4:
        if (!form.cityOrMarket.trim()) {
          setError("Enter your city or market");
          return false;
        }
        return true;
      case 5:
        if (!form.primaryGoal) {
          setError("Select your primary goal");
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function handleFinish() {
    if (!validateStep()) return;
    setError(null);
    startTransition(async () => {
      const result = await saveOnboarding(form);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-6">
        <Logo size="md" />
      </div>

      <Card className="w-full max-w-lg border-neutral-200">
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Step {step + 1} of {STEPS.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle>{STEPS[step].title}</CardTitle>
            <CardDescription>{STEPS[step].description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ONBOARDING_SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => updateField("selectedService", service)}
                  className={cn(
                    "rounded-lg border p-4 text-left text-sm transition-colors hover:border-brand",
                    form.selectedService === service
                      ? "border-brand bg-brand/5 ring-1 ring-brand"
                      : "border-neutral-200"
                  )}
                >
                  {service}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <OptionGrid
              options={BUDGET_OPTIONS}
              selected={form.startingBudget}
              onSelect={(v) => updateField("startingBudget", v)}
            />
          )}

          {step === 2 && (
            <OptionGrid
              options={EXPERIENCE_OPTIONS}
              selected={form.experienceLevel}
              onSelect={(v) => updateField("experienceLevel", v)}
            />
          )}

          {step === 3 && (
            <OptionGrid
              options={HOURS_OPTIONS}
              selected={form.availableHours}
              onSelect={(v) => updateField("availableHours", v)}
            />
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label htmlFor="cityOrMarket">City or market area</Label>
              <Input
                id="cityOrMarket"
                placeholder="e.g. Austin, TX or North Dallas suburbs"
                value={form.cityOrMarket}
                onChange={(e) => updateField("cityOrMarket", e.target.value)}
              />
            </div>
          )}

          {step === 5 && (
            <OptionGrid
              options={GOAL_OPTIONS}
              selected={form.primaryGoal}
              onSelect={(v) => updateField("primaryGoal", v)}
            />
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isPending}
                className="flex-1 bg-brand hover:bg-brand-hover"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className="flex-1 bg-brand hover:bg-brand-hover"
              >
                {isPending ? "Saving..." : "Start my challenge"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "w-full rounded-lg border p-4 text-left text-sm transition-colors hover:border-brand",
            selected === option
              ? "border-brand bg-brand/5 ring-1 ring-brand"
              : "border-neutral-200"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
