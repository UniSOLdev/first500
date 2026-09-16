"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ONBOARDING_SERVICES } from "@/content/challenge";
import { updateSettings, type SettingsInput } from "./actions";

const BUDGET_OPTIONS = [
  "Under $100",
  "$100 – $300",
  "$300 – $500",
  "$500+",
];

const HOURS_OPTIONS = [
  "1–5 hrs/week",
  "5–10 hrs/week",
  "10–20 hrs/week",
  "20+ hrs/week",
];

type SettingsFormProps = {
  initial: SettingsInput;
};

export function SettingsForm({ initial }: SettingsFormProps) {
  const [form, setForm] = useState<SettingsInput>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateSettings(form);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage("Settings saved");
      }
    });
  }

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your name and challenge details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectedService">Service</Label>
            <Select
              value={form.selectedService || undefined}
              onValueChange={(v) => {
                if (v) setForm((prev) => ({ ...prev, selectedService: v }));
              }}
            >
              <SelectTrigger id="selectedService" className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {ONBOARDING_SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cityOrMarket">City / market</Label>
            <Input
              id="cityOrMarket"
              value={form.cityOrMarket ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, cityOrMarket: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startingBudget">Starting budget</Label>
            <Select
              value={form.startingBudget || undefined}
              onValueChange={(v) => {
                if (v) setForm((prev) => ({ ...prev, startingBudget: v }));
              }}
            >
              <SelectTrigger id="startingBudget" className="w-full">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableHours">Available hours</Label>
            <Select
              value={form.availableHours || undefined}
              onValueChange={(v) => {
                if (v) setForm((prev) => ({ ...prev, availableHours: v }));
              }}
            >
              <SelectTrigger id="availableHours" className="w-full">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                {HOURS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-brand">{message}</p>}

          <Button
            type="submit"
            disabled={isPending}
            className="bg-brand hover:bg-brand-hover"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
