import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DayStatus } from "@/types/database";

export type TimelineDay = {
  number: number;
  slug: string;
  title: string;
  status: DayStatus;
};

type DayTimelineProps = {
  days: TimelineDay[];
  className?: string;
};

function StatusIcon({ status }: { status: DayStatus }) {
  if (status === "completed") {
    return <Check className="size-3.5 text-primary-foreground" />;
  }
  if (status === "in_progress" || status === "available") {
    return <Play className="size-3 text-primary-foreground" />;
  }
  return <Lock className="size-3 text-muted-foreground" />;
}

function statusLabel(status: DayStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In progress";
    case "available":
      return "Ready";
    default:
      return "Locked";
  }
}

export function DayTimeline({ days, className }: DayTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {days.map((day, index) => {
        const isLocked = day.status === "locked";
        const isActive =
          day.status === "available" || day.status === "in_progress";
        const isLast = index === days.length - 1;

        const content = (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  day.status === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/10 text-primary",
                  isLocked && "border-border bg-muted text-muted-foreground"
                )}
              >
                <StatusIcon status={day.status} />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "my-1 w-0.5 flex-1 min-h-6",
                    day.status === "completed" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>

            <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Day {day.number}
                </span>
                <Badge
                  variant={
                    day.status === "completed"
                      ? "default"
                      : isActive
                        ? "secondary"
                        : "outline"
                  }
                  className="text-[10px]"
                >
                  {statusLabel(day.status)}
                </Badge>
              </div>
              <p
                className={cn(
                  "mt-1 font-medium",
                  isLocked ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day.title}
              </p>
            </div>
          </div>
        );

        if (isLocked) {
          return (
            <div key={day.slug} className="opacity-70">
              {content}
            </div>
          );
        }

        return (
          <Link
            key={day.slug}
            href={`/challenge/${day.slug}`}
            className="block rounded-xl transition-colors hover:bg-muted/50 -mx-2 px-2 py-1"
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
