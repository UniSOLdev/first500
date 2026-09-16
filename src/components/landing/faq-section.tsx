import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What is FIRST $500?",
    answer:
      "FIRST $500 is a 7-day challenge that helps you build a local service business from scratch. Each day has a focused lesson, tasks, and a deliverable you save to your dashboard — like choosing your service, building an offer, setting prices, and starting customer outreach.",
  },
  {
    question: "How does the 7-day challenge work?",
    answer:
      "After purchase, you get instant access to your dashboard. Complete one day at a time — each unlocks the next when you finish. Days take about 45–90 minutes. You work through lessons, use the built-in tools, and save deliverables you can reference later.",
  },
  {
    question: "Do I need business experience?",
    answer:
      "No. The challenge is designed for beginners. You don't need an LLC, a website, or prior sales experience to start. Day 4 covers making your business look legitimate, including reminders to verify local licensing and registration requirements.",
  },
  {
    question: "What local services does this work for?",
    answer:
      "The challenge supports common local services like auto detailing, pressure washing, window cleaning, residential cleaning, lawn care, junk removal, handyman work, and pet services. You pick one service and focus on it for all 7 days.",
  },
  {
    question: "What do I get for $17?",
    answer:
      "Full access to all 7 daily lessons, your personal dashboard, interactive builders (offer, pricing, prospect list, outreach tracker), outreach scripts, an AI coach, and the resource library — with lifetime access and no subscription.",
  },
  {
    question: "Will I guaranteed earn $500?",
    answer:
      "No. We do not guarantee any specific income or number of customers. Results depend on your effort, market, service choice, pricing, and follow-through. The challenge gives you a system to work toward your first $500 in booked revenue — execution is up to you.",
  },
  {
    question: "Do I need licenses or permits?",
    answer:
      "Requirements vary by location and service type. You are responsible for researching and complying with all local licensing, registration, tax, and insurance requirements before taking paid jobs. The challenge reminds you to verify this — it does not provide legal advice.",
  },
  {
    question: "How long do I have access?",
    answer:
      "Lifetime access. Pay once and revisit lessons, scripts, and your saved deliverables anytime. There is no monthly fee.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Refund terms are outlined in our Terms of Service. If you have an issue with your purchase, contact support through the email provided at checkout.",
  },
  {
    question: "How does the AI coach work?",
    answer:
      "The AI coach is available throughout the challenge to help when you're stuck — comparing services, refining your offer, adjusting pricing, or improving outreach messages. It uses context from your profile and progress to give relevant guidance.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border/60 bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Straight answers — no hype.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border/60 bg-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    "group-open:rotate-180"
                  )}
                />
              </summary>
              <div className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
