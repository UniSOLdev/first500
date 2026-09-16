"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EntitlementStatus = {
  active: boolean;
  purchasedAt: string | null;
};

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

export function SuccessClient() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming payment…");

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
              router.replace("/onboarding");
              return;
            }
          }
        } catch {
          // Keep polling — webhook may still be processing.
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!cancelled) {
        setMessage(
          "Payment received. Your access is still being confirmed — refresh in a moment or contact support if this persists."
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
        <CardTitle>Almost there</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Setting up your challenge access
        </div>
      </CardContent>
    </Card>
  );
}
