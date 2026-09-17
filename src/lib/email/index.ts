import { getSupportEmail } from "@/lib/support";

type WelcomeEmailParams = {
  to: string;
  fullName?: string | null;
};

/**
 * Sends welcome email after purchase. No-ops gracefully when email provider
 * is not configured — purchase flow must never depend on email delivery.
 *
 * Production setup: add RESEND_API_KEY and EMAIL_FROM to Vercel env vars.
 */
export async function sendWelcomeEmail({
  to,
  fullName,
}: WelcomeEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() ||
    `FIRST $500 <onboarding@${getSupportEmail().split("@")[1] ?? "first500.app"}>`;

  if (!apiKey) {
    console.info("[email] RESEND_API_KEY not set — skipping welcome email to", to);
    return false;
  }

  const name = fullName?.trim() || "there";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://first500-fawn.vercel.app";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "You're in — start Day 1 of FIRST $500",
        html: `
          <p>Hi ${name},</p>
          <p>Your payment went through. Your 7-day challenge is unlocked.</p>
          <p><a href="${siteUrl}/dashboard">Go to your dashboard</a> and start Day 1 when you're ready.</p>
          <p>Questions? Reply to this email or contact ${getSupportEmail()}.</p>
          <p>— FIRST $500</p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[email] Welcome email failed:", response.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Welcome email error:", error);
    return false;
  }
}
