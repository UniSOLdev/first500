"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoreOfferDeliverable } from "@/content/challenge";
import { CopyButton } from "@/components/challenge/copy-button";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Day2OfferBuilderProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: CoreOfferDeliverable;
  defaultService?: string;
  onValidityChange?: (valid: boolean) => void;
};

const EMPTY: CoreOfferDeliverable = {
  service: "",
  idealCustomer: "",
  coreJob: "",
  benefit: "",
  basePackage: "",
  upgrade: "",
  offerStatement: "",
};

export function Day2OfferBuilder({
  dayNumber,
  deliverableKey,
  initialData,
  defaultService = "",
  onValidityChange,
}: Day2OfferBuilderProps) {
  const { savePartial } = useDaySave();
  const [form, setForm] = useState<CoreOfferDeliverable>({
    ...EMPTY,
    service: defaultService,
    ...initialData,
  });

  const offerStatement = useMemo(() => {
    const { service, idealCustomer, coreJob, benefit, basePackage, upgrade } =
      form;
    if (!service || !idealCustomer || !coreJob) return "";

    let statement = `We ${coreJob} for ${idealCustomer}`;
    if (benefit) statement += ` so they ${benefit}`;
    if (basePackage) statement += `. Our ${basePackage} package`;
    if (upgrade) statement += ` includes an optional upgrade: ${upgrade}`;
    statement += ".";
    return statement;
  }, [form]);

  useEffect(() => {
    const valid =
      Boolean(form.service.trim()) &&
      Boolean(form.idealCustomer.trim()) &&
      Boolean(form.coreJob.trim()) &&
      Boolean(offerStatement.trim());
    onValidityChange?.(valid);
  }, [form, offerStatement, onValidityChange]);

  useEffect(() => {
    savePartial({ [deliverableKey]: { ...form, offerStatement } });
  }, [form, offerStatement, deliverableKey, savePartial]);

  function updateField<K extends keyof CoreOfferDeliverable>(
    key: K,
    value: CoreOfferDeliverable[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            value={form.service}
            onChange={(e) => updateField("service", e.target.value)}
            placeholder="e.g., Mobile auto detailing"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idealCustomer">Ideal customer</Label>
          <Input
            id="idealCustomer"
            value={form.idealCustomer}
            onChange={(e) => updateField("idealCustomer", e.target.value)}
            placeholder="e.g., busy professionals with nice cars"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="coreJob">Core job (what you do)</Label>
          <Input
            id="coreJob"
            value={form.coreJob}
            onChange={(e) => updateField("coreJob", e.target.value)}
            placeholder="e.g., bring showroom-level interior and exterior detailing to their driveway"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="benefit">Key benefit / result</Label>
          <Input
            id="benefit"
            value={form.benefit}
            onChange={(e) => updateField("benefit", e.target.value)}
            placeholder="e.g., save time and keep their car looking new without visiting a shop"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basePackage">Base package name</Label>
          <Input
            id="basePackage"
            value={form.basePackage}
            onChange={(e) => updateField("basePackage", e.target.value)}
            placeholder="e.g., Full Detail"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="upgrade">Optional upgrade</Label>
          <Input
            id="upgrade"
            value={form.upgrade}
            onChange={(e) => updateField("upgrade", e.target.value)}
            placeholder="e.g., ceramic coating add-on"
          />
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Your offer statement</CardTitle>
          {offerStatement && <CopyButton text={offerStatement} />}
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={offerStatement}
            placeholder="Fill in the fields above to generate your offer statement…"
            className="min-h-24 resize-none bg-background"
          />
        </CardContent>
      </Card>
    </div>
  );
}
