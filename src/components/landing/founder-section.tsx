import { Wrench, MapPin, Target } from "lucide-react";

const PROOF_PLACEHOLDER_CLASS =
  "flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground";

export function FounderSection() {
  return (
    <section className="border-y border-border/60 bg-muted/20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Built from real work
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A framework from actually building local service businesses
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              FIRST $500 is not theory pulled from a slide deck. The daily
              structure, outreach scripts, and pricing exercises come from
              building and operating local service work — choosing a service,
              talking to real prospects, and refining what converts.
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  Practical daily actions — not vague &ldquo;mindset&rdquo; content
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  Built for local markets where trust and follow-up matter
                </span>
              </li>
              <li className="flex gap-3">
                <Target className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  Focused on landing your first customers, not promising overnight income
                </span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Results vary. This is a system to work toward your first $500 — not
              a guarantee of any specific outcome.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={PROOF_PLACEHOLDER_CLASS}>
              Proof screenshot — outreach results
            </div>
            <div className={PROOF_PLACEHOLDER_CLASS}>
              Proof screenshot — booked job / invoice
            </div>
            <div className={`${PROOF_PLACEHOLDER_CLASS} sm:col-span-2`}>
              Proof screenshot — dashboard / day progress
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
