import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ITEMS = [
  {
    icon: LayoutDashboard,
    title: "Personal dashboard",
    description:
      "Track your progress, save deliverables, and see exactly what to do today.",
  },
  {
    icon: BookOpen,
    title: "7 daily lessons",
    description:
      "Focused lessons with clear objectives — no fluff, no hour-long videos.",
  },
  {
    icon: ClipboardList,
    title: "Interactive builders",
    description:
      "Offer builder, pricing builder, prospect tracker, and outreach tools.",
  },
  {
    icon: MessageSquare,
    title: "Outreach scripts",
    description:
      "DM templates, follow-ups, and posting scripts you can personalize.",
  },
  {
    icon: Sparkles,
    title: "AI coach",
    description:
      "Context-aware help when you're stuck between services, prices, or messages.",
  },
  {
    icon: Target,
    title: "Resource library",
    description:
      "Checklists, service comparisons, and reference guides you keep forever.",
  },
] as const;

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What you get
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to go from zero to a working local service
            business — in one purchase.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-border/60">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
