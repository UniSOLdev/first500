import { CHALLENGE_DAYS } from "@/content/challenge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Seven focused days. One deliverable per day. By the end you have a
            real business system — not just notes.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CHALLENGE_DAYS.map((day) => (
            <Card key={day.slug} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Day {day.number}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {day.estimatedTime}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">
                  {day.title}
                </CardTitle>
                <CardDescription>{day.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {day.objective}
                </p>
                <p className="mt-3 text-xs font-medium text-primary">
                  → {day.milestone}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
