"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, undefined);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md border-neutral-200">
        <CardHeader className="text-center">
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>We&apos;ll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Check your email for a password reset link.
              </p>
              <Link href="/login" className="text-brand hover:underline text-sm">
                Back to login
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
              <Button type="submit" className="w-full bg-brand hover:bg-brand-hover" disabled={pending}>
                Send reset link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
