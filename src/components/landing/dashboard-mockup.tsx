import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MOCK_DAYS = [
  { day: 1, title: "Choose Your Money-Maker", done: true },
  { day: 2, title: "Build an Offer", done: true },
  { day: 3, title: "Price It", done: false, active: true },
  { day: 4, title: "Look Legit", done: false },
];

export function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
      <Card className="relative overflow-hidden border-border/80 shadow-xl shadow-primary/5">
        <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Your Dashboard
              </p>
              <CardTitle className="mt-1 text-lg">Day 3 of 7</CardTitle>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-3" />
              AI Coach
            </Badge>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground tabular-nums">2/7 complete</span>
            </div>
            <Progress value={28} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Today&apos;s Mission
            </p>
            <p className="mt-1 font-medium text-foreground">Price It</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Build three pricing tiers you can quote confidently.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              7-Day Journey
            </p>
            {MOCK_DAYS.map((item) => (
              <div
                key={item.day}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  item.active ? "bg-primary/10 ring-1 ring-primary/20" : ""
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                ) : (
                  <Circle
                    className={`size-4 shrink-0 ${
                      item.active ? "text-primary" : "text-muted-foreground/40"
                    }`}
                  />
                )}
                <span
                  className={
                    item.done || item.active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  Day {item.day}: {item.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
