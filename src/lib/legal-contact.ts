import { getSupportEmail } from "@/lib/support";

export function getLegalContactLine(): string {
  const email = getSupportEmail();
  return `Contact us at ${email}.`;
}
