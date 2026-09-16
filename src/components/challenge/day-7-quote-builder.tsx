"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClosingSystemDeliverable } from "@/content/challenge";
import { CopyButton } from "@/components/challenge/copy-button";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";

type Day7QuoteBuilderProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: ClosingSystemDeliverable;
  defaultService?: string;
  onValidityChange?: (valid: boolean) => void;
};

const EMPTY: ClosingSystemDeliverable = {
  customerName: "",
  service: "",
  scopeItems: ["", "", ""],
  price: 0,
  upgrade: "",
  upgradePrice: 0,
  notes: "",
  quoteText: "",
};

export function Day7QuoteBuilder({
  deliverableKey,
  initialData,
  defaultService = "",
  onValidityChange,
}: Day7QuoteBuilderProps) {
  const { savePartial } = useDaySave();
  const [form, setForm] = useState<ClosingSystemDeliverable>({
    ...EMPTY,
    service: defaultService,
    ...initialData,
    scopeItems: initialData?.scopeItems?.length
      ? initialData.scopeItems
      : ["", "", ""],
  });

  const quoteText = useMemo(() => {
    const scope = form.scopeItems.filter((s) => s.trim());
    const lines = [
      `QUOTE`,
      ``,
      `Customer: ${form.customerName || "[Customer Name]"}`,
      `Service: ${form.service || "[Service]"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `Scope:`,
      ...scope.map((item) => `- ${item}`),
      ``,
      `Price: $${form.price || 0}`,
    ];
    if (form.upgrade.trim()) {
      lines.push(
        `Optional upgrade: ${form.upgrade} — +$${form.upgradePrice || 0}`
      );
    }
    if (form.notes.trim()) {
      lines.push(``, `Notes: ${form.notes}`);
    }
    lines.push(
      ``,
      `This quote is valid for 7 days. Reply to confirm and we'll get you scheduled!`,
      ``,
      `[Your Name]`,
      `[Phone/Email]`
    );
    return lines.join("\n");
  }, [form]);

  useEffect(() => {
    const valid =
      Boolean(form.customerName.trim()) &&
      Boolean(form.service.trim()) &&
      form.scopeItems.some((s) => s.trim()) &&
      form.price > 0;
    onValidityChange?.(valid);
    savePartial({ [deliverableKey]: { ...form, quoteText } });
  }, [form, quoteText, deliverableKey, savePartial, onValidityChange]);

  function updateField<K extends keyof ClosingSystemDeliverable>(
    key: K,
    value: ClosingSystemDeliverable[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateScope(index: number, value: string) {
    setForm((prev) => {
      const scopeItems = [...prev.scopeItems];
      scopeItems[index] = value;
      return { ...prev, scopeItems };
    });
  }

  function addScopeItem() {
    setForm((prev) => ({
      ...prev,
      scopeItems: [...prev.scopeItems, ""],
    }));
  }

  function removeScopeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      scopeItems: prev.scopeItems.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input
            id="customerName"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Sample customer for practice"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            value={form.service}
            onChange={(e) => updateField("service", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            value={form.price || ""}
            onChange={(e) => updateField("price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="upgrade">Optional upgrade</Label>
          <Input
            id="upgrade"
            value={form.upgrade}
            onChange={(e) => updateField("upgrade", e.target.value)}
            placeholder="e.g., premium wax treatment"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="upgradePrice">Upgrade price ($)</Label>
          <Input
            id="upgradePrice"
            type="number"
            min={0}
            value={form.upgradePrice || ""}
            onChange={(e) =>
              updateField("upgradePrice", Number(e.target.value))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Scope items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addScopeItem}>
            <PlusIcon />
            Add item
          </Button>
        </div>
        {form.scopeItems.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateScope(index, e.target.value)}
              placeholder={`Scope item ${index + 1}`}
            />
            {form.scopeItems.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeScopeItem(index)}
                aria-label="Remove scope item"
              >
                <Trash2Icon />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Scheduling details, access instructions, etc."
          rows={2}
        />
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Your quote</CardTitle>
          <CopyButton text={quoteText} label="Copy quote" />
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={quoteText}
            className="min-h-64 resize-none bg-background font-mono text-xs"
          />
        </CardContent>
      </Card>
    </div>
  );
}
