"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT } from "@/config/product";
import { track } from "@/lib/analytics";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@first500.app";

export function CheckoutClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const startedRef = useRef(false);

  const startCheckout = useCallback(async (isRetry = false) => {
    if (isRetry) {
      setError(null);
      setLoading(true);
    }

    try {
      track("checkout_started");
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as {
        url?: string;
        error?: string;
        redirect?: string;
      };

      if (response.status === 409 && data.redirect) {
        router.replace(data.redirect);
        return;
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startCheckout();
  }, [startCheckout]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{PRODUCT.name}</CardTitle>
        <CardDescription>
          {PRODUCT.descriptor} — {PRODUCT.displayPrice} one-time
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading && !error ? (
          <p className="text-sm text-muted-foreground">
            Redirecting you to secure Stripe checkout…
          </p>
        ) : null}
        {error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => void startCheckout(true)} disabled={loading}>
              Try again
            </Button>
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
