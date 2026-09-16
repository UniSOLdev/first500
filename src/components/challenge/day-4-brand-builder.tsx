"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BRAND_CHECKLIST,
  type BusinessProfileDeliverable,
} from "@/content/challenge";
import { CopyButton } from "@/components/challenge/copy-button";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type Day4BrandBuilderProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: BusinessProfileDeliverable;
  defaultOffer?: string;
  onValidityChange?: (valid: boolean) => void;
};

const EMPTY: BusinessProfileDeliverable = {
  businessName: "",
  tagline: "",
  shortDescription: "",
  facebookBio: "",
  instagramBio: "",
  googleDescription: "",
  contactPhone: "",
  contactEmail: "",
  onlinePresence: "",
  checklistCompleted: [],
};

export function Day4BrandBuilder({
  deliverableKey,
  initialData,
  defaultOffer = "",
  onValidityChange,
}: Day4BrandBuilderProps) {
  const { savePartial } = useDaySave();
  const [form, setForm] = useState<BusinessProfileDeliverable>({
    ...EMPTY,
    shortDescription: defaultOffer,
    ...initialData,
  });

  const bios = useMemo(() => {
    const name = form.businessName || "[Business Name]";
    const desc = form.shortDescription || form.tagline || "[your service description]";
    return {
      facebookBio: form.facebookBio ||
        `${name} — ${desc}. Serving local customers with reliable, professional service. Message us for a quote!`,
      instagramBio: form.instagramBio ||
        `${name}\n${form.tagline || desc}\n📍 Local service\nDM for quotes 👇`,
      googleDescription: form.googleDescription ||
        `${name} provides ${desc}. Contact us at ${form.contactPhone || form.contactEmail || "[phone/email]"} to schedule.`,
    };
  }, [form]);

  useEffect(() => {
    const payload = { ...form, ...bios };
    const valid =
      Boolean(form.businessName.trim()) &&
      Boolean(form.shortDescription.trim()) &&
      Boolean(form.onlinePresence.trim()) &&
      form.checklistCompleted.length >= 4;
    onValidityChange?.(valid);
    savePartial({ [deliverableKey]: payload });
  }, [form, bios, deliverableKey, savePartial, onValidityChange]);

  function updateField<K extends keyof BusinessProfileDeliverable>(
    key: K,
    value: BusinessProfileDeliverable[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleChecklist(id: string) {
    setForm((prev) => {
      const completed = prev.checklistCompleted.includes(id)
        ? prev.checklistCompleted.filter((c) => c !== id)
        : [...prev.checklistCompleted, id];
      return { ...prev, checklistCompleted: completed };
    });
  }

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">Brand checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {BRAND_CHECKLIST.map((item) => {
            const done = form.checklistCompleted.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklist(item.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  done ? "border-primary/30 bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                    done && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {done && <CheckIcon className="size-3" />}
                </span>
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  {item.hint && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {item.hint}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="e.g., Mike's Mobile Detailing"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tagline">Tagline (optional)</Label>
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            placeholder="e.g., Showroom shine at your driveway"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea
            id="shortDescription"
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone</Label>
          <Input
            id="contactPhone"
            value={form.contactPhone}
            onChange={(e) => updateField("contactPhone", e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="onlinePresence">Online presence URL</Label>
          <Input
            id="onlinePresence"
            value={form.onlinePresence}
            onChange={(e) => updateField("onlinePresence", e.target.value)}
            placeholder="https://facebook.com/yourpage or Instagram handle"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Generated bios (edit or copy)</h3>
        {(
          [
            ["facebookBio", "Facebook bio"],
            ["instagramBio", "Instagram bio"],
            ["googleDescription", "Google Business description"],
          ] as const
        ).map(([key, label]) => (
          <Card key={key} size="sm">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{label}</CardTitle>
              <CopyButton text={bios[key]} />
            </CardHeader>
            <CardContent>
              <Textarea
                value={form[key] || bios[key]}
                onChange={(e) => updateField(key, e.target.value)}
                rows={key === "instagramBio" ? 4 : 3}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
