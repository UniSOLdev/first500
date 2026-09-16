import { Check, X } from "lucide-react";

const FOR_YOU = [
  "You want to start a local service business but don't know where to begin",
  "You have a service in mind but need help with offer, pricing, and outreach",
  "You learn best by doing — one clear task per day",
  "You can commit 45–90 minutes per day for 7 days",
  "You're willing to reach out to real people (not just watch videos)",
] as const;

const NOT_FOR_YOU = [
  "You want passive income with zero customer contact",
  "You're looking for a guaranteed income or get-rich-quick scheme",
  "You won't take action on outreach and follow-up",
  "You need someone else to run the business for you",
] as const;

export function WhoThisIsFor() {
  return (
    <section className="border-y border-border/60 bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Who this is for
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Be honest with yourself — this challenge works when you show up and
            do the work.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <h3 className="font-semibold text-foreground">This is for you if…</h3>
            <ul className="mt-4 space-y-3">
              {FOR_YOU.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
            <h3 className="font-semibold text-foreground">This is not for you if…</h3>
            <ul className="mt-4 space-y-3">
              {NOT_FOR_YOU.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
