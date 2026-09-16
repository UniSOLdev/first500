import { AlertCircle, Clock, Layers, TrendingDown } from "lucide-react";

const PAINS = [
  {
    icon: Layers,
    title: "Too many ideas, no focus",
    description:
      "You keep researching services instead of picking one and selling it.",
  },
  {
    icon: Clock,
    title: "Planning instead of doing",
    description:
      "Weeks go by on logos and business plans while customers never hear from you.",
  },
  {
    icon: TrendingDown,
    title: "No clear path to revenue",
    description:
      "You know you want local service income but don't have a step-by-step system.",
  },
  {
    icon: AlertCircle,
    title: "Outreach feels awkward",
    description:
      "You don't know what to say, who to contact, or how to follow up.",
  },
] as const;

export function PainSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            You don&apos;t need another course to watch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            You need a simple system that tells you exactly what to do today —
            and helps you do it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PAINS.map((pain) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card p-6"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{pain.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {pain.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
