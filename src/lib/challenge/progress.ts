import type { ChallengeProgress, DayStatus } from "@/types/database";
import { CHALLENGE_DAYS, TOTAL_DAYS } from "@/content/challenge";

export function computeDayStates(
  progressRows: ChallengeProgress[]
): Record<number, DayStatus> {
  const states: Record<number, DayStatus> = {};

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const row = progressRows.find((p) => p.day_number === day);
    if (row) {
      states[day] = row.status;
    } else if (day === 1) {
      states[day] = "available";
    } else {
      const prev = progressRows.find((p) => p.day_number === day - 1);
      states[day] =
        prev?.status === "completed" ? "available" : "locked";
    }
  }

  return states;
}

export function getCurrentDay(states: Record<number, DayStatus>): number {
  const inProgress = Object.entries(states).find(
    ([, status]) => status === "in_progress"
  );
  if (inProgress) return Number(inProgress[0]);

  const available = Object.entries(states)
    .filter(([, status]) => status === "available")
    .map(([day]) => Number(day))
    .sort((a, b) => a - b)[0];
  if (available) return available;

  const allCompleted = Object.values(states).every(
    (s) => s === "completed"
  );
  if (allCompleted) return TOTAL_DAYS;

  return 1;
}

export function countCompletedDays(states: Record<number, DayStatus>): number {
  return Object.values(states).filter((s) => s === "completed").length;
}

export function getDayBySlug(slug: string) {
  return CHALLENGE_DAYS.find((d) => d.slug === slug);
}

export function getDayByNumber(num: number) {
  return CHALLENGE_DAYS.find((d) => d.number === num);
}

export function getMomentumMessage(completedCount: number): string | null {
  const messages: Record<number, string> = {
    1: "Offer built.",
    2: "Pricing locked.",
    3: "Looking legit.",
    4: "Ready to prospect.",
    5: "Outreach started.",
    6: "Closing system ready.",
    7: "Challenge completed.",
  };
  return messages[completedCount] ?? null;
}
