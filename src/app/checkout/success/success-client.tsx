"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [message, setMessage] = useState("Confirming your payment…");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    track("purchase_completed");
  }, []);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      while (!cancelled && attempts < MAX_ATTEMPTS) {
        attempts += 1;

        try {
          const response = await fetch("/api/entitlements/status");
          if (response.ok) {
            const data = (await response.json()) as EntitlementStatus;
            if (data.active) {
              router.replace("/dashboard");
              return;
            }
          }
        } catch {
          // Webhook may still be processing
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
  }, [router]);

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
              className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-brand px-2.5 text-sm font-medium text-primary-foreground hover:bg-brand-hover"
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
