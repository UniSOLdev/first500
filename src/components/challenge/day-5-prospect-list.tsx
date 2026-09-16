"use client";

import { useEffect, useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  PROSPECT_CHANNELS,
  PROSPECT_STATUSES,
  type Prospect,
  type ProspectListDeliverable,
  type ProspectStatus,
} from "@/content/challenge";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Day5ProspectListProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: ProspectListDeliverable;
  onValidityChange?: (valid: boolean) => void;
};

function createEmptyProspect(index: number): Prospect {
  return {
    id: `prospect-${index}-${Date.now()}`,
    name: "",
    channel: PROSPECT_CHANNELS[0],
    status: "not_contacted",
  };
}

function buildInitialProspects(data?: ProspectListDeliverable): Prospect[] {
  if (data?.prospects?.length) {
    const prospects = [...data.prospects];
    while (prospects.length < 25) {
      prospects.push(createEmptyProspect(prospects.length));
    }
    return prospects.slice(0, 25);
  }
  return Array.from({ length: 25 }, (_, i) => createEmptyProspect(i));
}

export function Day5ProspectList({
  dayNumber,
  deliverableKey,
  initialData,
  onValidityChange,
}: Day5ProspectListProps) {
  const { savePartial } = useDaySave();
  const [prospects, setProspects] = useState<Prospect[]>(() =>
    buildInitialProspects(initialData)
  );

  const filledCount = prospects.filter((p) => p.name.trim()).length;

  useEffect(() => {
    const filled = prospects.filter((p) => p.name.trim());
    const valid = filled.length >= 25;
    onValidityChange?.(valid);
    savePartial({ [deliverableKey]: { prospects: filled } });
  }, [prospects, deliverableKey, savePartial, onValidityChange]);

  function updateProspect(id: string, patch: Partial<Prospect>) {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function removeProspect(id: string) {
    setProspects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      while (next.length < 25) {
        next.push(createEmptyProspect(next.length));
      }
      return next;
    });
  }

  function addRow() {
    setProspects((prev) => [...prev, createEmptyProspect(prev.length)]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span>
          <span className="font-medium">{filledCount}</span> of 25 prospects
          added
        </span>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <PlusIcon />
          Add row
        </Button>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">Prospect list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="hidden gap-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[1fr_140px_140px_32px]">
            <span>Name</span>
            <span>Channel</span>
            <span>Status</span>
            <span />
          </div>
          {prospects.map((prospect, index) => (
            <div
              key={prospect.id}
              className="grid gap-2 rounded-lg border p-2 sm:grid-cols-[1fr_140px_140px_32px] sm:border-0 sm:p-0"
            >
              <Input
                value={prospect.name}
                onChange={(e) =>
                  updateProspect(prospect.id, { name: e.target.value })
                }
                placeholder={`Prospect ${index + 1}`}
              />
              <Select
                value={prospect.channel}
                onValueChange={(value) =>
                  updateProspect(prospect.id, { channel: value as string })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROSPECT_CHANNELS.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={prospect.status}
                onValueChange={(value) =>
                  updateProspect(prospect.id, {
                    status: value as ProspectStatus,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROSPECT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeProspect(prospect.id)}
                aria-label="Remove prospect"
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
