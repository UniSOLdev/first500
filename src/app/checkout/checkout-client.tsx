"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT } from "@/config/product";

export function CheckoutClient() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const startedRef = useRef(false);

  const startCheckout = useCallback(async (isRetry = false) => {
    if (isRetry) {
      setError(null);
      setLoading(true);
    }

    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, []);

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
          {PRODUCT.descriptor} — {PRODUCT.displayPrice}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading && !error ? (
          <p className="text-sm text-muted-foreground">
            Redirecting you to secure checkout…
          </p>
        ) : null}
        {error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => void startCheckout(true)} disabled={loading}>
              {PRODUCT.ctaPrimary}
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
