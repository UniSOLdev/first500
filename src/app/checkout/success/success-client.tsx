"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { track } from "@/lib/analytics";

type EntitlementStatus = {
  active: boolean;
  purchasedAt: string | null;
};

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@first500.app";

export function SuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [message, setMessage] = useState("Confirming your payment…");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    track("purchase_completed");
  }, []);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;
    let verifiedSession = false;

    async function checkEntitlement(): Promise<boolean> {
      const response = await fetch("/api/entitlements/status");
      if (!response.ok) return false;
      const data = (await response.json()) as EntitlementStatus;
      return data.active;
    }

    async function verifyWithStripe(): Promise<boolean> {
      if (!sessionId || verifiedSession) return false;
      verifiedSession = true;

      try {
        const response = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!response.ok) return false;
        const data = (await response.json()) as { active?: boolean };
        return !!data.active;
      } catch {
        return false;
      }
    }

    async function poll() {
      // Try Stripe verify once early if we have session_id (webhook may be delayed)
      if (sessionId) {
        const verified = await verifyWithStripe();
        if (verified && !cancelled) {
          router.replace("/dashboard");
          return;
        }
      }

      while (!cancelled && attempts < MAX_ATTEMPTS) {
        attempts += 1;

        try {
          if (await checkEntitlement()) {
            router.replace("/dashboard");
            return;
          }

          // Retry verify after a few poll attempts
          if (sessionId && attempts === 5) {
            const verified = await verifyWithStripe();
            if (verified && !cancelled) {
              router.replace("/dashboard");
              return;
            }
          }
        } catch {
          // Keep polling
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!cancelled) {
        setPending(false);
        setMessage(
          "Payment received. Access is taking longer than usual to activate."
        );
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment successful</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Unlocking your challenge…
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-primary-foreground hover:bg-brand-hover"
            >
              Go to dashboard
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Refresh access status
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Still locked out after a few minutes? Email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
