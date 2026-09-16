"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import {
  SERVICE_OPTIONS,
  type SelectedServiceDeliverable,
} from "@/content/challenge";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Day1ServicePickerProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: SelectedServiceDeliverable;
  onValidityChange?: (valid: boolean) => void;
};

export function Day1ServicePicker({
  deliverableKey,
  initialData,
  onValidityChange,
}: Day1ServicePickerProps) {
  const { savePartial, isSaving } = useDaySave();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialData?.serviceId ?? null
  );
  const [locked, setLocked] = useState(Boolean(initialData?.serviceId));

  useEffect(() => {
    onValidityChange?.(Boolean(selectedId && locked));
  }, [selectedId, locked, onValidityChange]);

  function handleSelect(id: string) {
    if (locked) return;
    setSelectedId(id);
  }

  function handleLockIn() {
    if (!selectedId) return;
    const service = SERVICE_OPTIONS.find((s) => s.id === selectedId);
    if (!service) return;

    const data: SelectedServiceDeliverable = {
      serviceId: service.id,
      serviceName: service.name,
    };
    savePartial({ [deliverableKey]: data });
    setLocked(true);
  }

  function handleChangeSelection() {
    setLocked(false);
  }

  const selected = SERVICE_OPTIONS.find((s) => s.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              disabled={locked && !isSelected}
              onClick={() => handleSelect(service.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:bg-muted/50",
                locked && !isSelected && "opacity-40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{service.name}</span>
                {isSelected && locked && (
                  <CheckIcon className="size-4 text-primary" />
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <div>
                  <dt className="inline">Startup: </dt>
                  <dd className="inline">{service.startupCost}</dd>
                </div>
                <div>
                  <dt className="inline">Demand: </dt>
                  <dd className="inline">{service.demand}</dd>
                </div>
                <div>
                  <dt className="inline">Avg job: </dt>
                  <dd className="inline">{service.avgJobValue}</dd>
                </div>
                <div>
                  <dt className="inline">Start speed: </dt>
                  <dd className="inline">{service.startSpeed}</dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your selection</CardTitle>
            <CardDescription>
              {locked
                ? "Service locked in. You can change it before completing the day."
                : "Review your choice, then lock it in to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{selected.name}</Badge>
            {!locked ? (
              <Button onClick={handleLockIn} disabled={isSaving}>
                Lock in service
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleChangeSelection}>
                Change selection
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
