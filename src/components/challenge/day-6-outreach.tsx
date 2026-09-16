"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { DAY6_SCRIPTS, type Resource } from "@/content/resources";
import {
  OUTREACH_ACTION_TYPES,
  type FirstOutreachDeliverable,
  type OutreachAction,
} from "@/content/challenge";
import { CopyButton } from "@/components/challenge/copy-button";
import { useDaySave } from "@/components/challenge/use-day-save";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Day6OutreachProps = {
  dayNumber: number;
  deliverableKey: string;
  initialData?: FirstOutreachDeliverable;
  onValidityChange?: (valid: boolean) => void;
};

function createAction(index: number): OutreachAction {
  return {
    id: `action-${index}-${Date.now()}`,
    type: OUTREACH_ACTION_TYPES[0],
    target: "",
    completed: false,
  };
}

function buildInitialActions(data?: FirstOutreachDeliverable): OutreachAction[] {
  if (data?.actions?.length) {
    const actions = [...data.actions];
    while (actions.length < 10) {
      actions.push(createAction(actions.length));
    }
    return actions.slice(0, 10);
  }
  return Array.from({ length: 10 }, (_, i) => createAction(i));
}

function ScriptCard({ resource }: { resource: Resource }) {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm">{resource.title}</CardTitle>
          <Badge variant="outline" className="mt-1">
            {resource.category}
          </Badge>
        </div>
        <CopyButton text={resource.content} />
      </CardHeader>
      <CardContent>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
          {resource.content}
        </pre>
      </CardContent>
    </Card>
  );
}

export function Day6Outreach({
  deliverableKey,
  initialData,
  onValidityChange,
}: Day6OutreachProps) {
  const { savePartial } = useDaySave();
  const [actions, setActions] = useState<OutreachAction[]>(() =>
    buildInitialActions(initialData)
  );

  const completedCount = actions.filter((a) => a.completed).length;

  useEffect(() => {
    const valid = completedCount >= 10;
    onValidityChange?.(valid);
    savePartial({ [deliverableKey]: { actions } });
  }, [actions, completedCount, deliverableKey, savePartial, onValidityChange]);

  function updateAction(id: string, patch: Partial<OutreachAction>) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  }

  function toggleComplete(id: string) {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-medium">Outreach scripts</h3>
        <p className="text-sm text-muted-foreground">
          Copy a script, personalize it for your service and market, then log
          your action below.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {DAY6_SCRIPTS.map((script) => (
            <ScriptCard key={script.id} resource={script} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Outreach tracker</h3>
          <Badge variant={completedCount >= 10 ? "default" : "secondary"}>
            {completedCount} / 10 complete
          </Badge>
        </div>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className={cn(
                "grid gap-2 rounded-lg border p-2 sm:grid-cols-[auto_1fr_140px_1fr]",
                action.completed && "border-primary/30 bg-primary/5"
              )}
            >
              <Button
                type="button"
                variant={action.completed ? "default" : "outline"}
                size="icon-sm"
                onClick={() => toggleComplete(action.id)}
                aria-label={`Mark action ${index + 1} complete`}
              >
                <CheckIcon />
              </Button>
              <Select
                value={action.type}
                onValueChange={(value) =>
                  updateAction(action.id, { type: value as string })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTREACH_ACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={action.target}
                onChange={(e) =>
                  updateAction(action.id, { target: e.target.value })
                }
                placeholder="Who / where"
                className="sm:col-span-2"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
