import {
  Bot,
  CalendarCheck,
  FileText,
  Infinity,
  Users,
} from "lucide-react";

const POINTS = [
  {
    icon: CalendarCheck,
    title: "7 actionable days",
    description:
      "Each day has a clear objective, tasks, and a deliverable you save to your dashboard.",
  },
  {
    icon: FileText,
    title: "Scripts & templates",
    description:
      "Outreach messages, follow-ups, and quote templates you can copy and personalize.",
  },
  {
    icon: Bot,
    title: "AI coach included",
    description:
      "Get unstuck on offers, pricing, and messaging with context-aware guidance.",
  },
  {
    icon: Infinity,
    title: "Lifetime access",
    description:
      "Revisit lessons, scripts, and your saved work anytime — no subscription.",
  },
  {
    icon: Users,
    title: "Built for beginners",
    description:
      "No business degree required. Start from zero and build one step at a time.",
  },
] as const;

export function TrustPoints() {
  return (
    <section className="border-y border-border/60 bg-card px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <div key={point.title} className="space-y-2 text-center sm:text-left">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mx-0">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-foreground">{point.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
