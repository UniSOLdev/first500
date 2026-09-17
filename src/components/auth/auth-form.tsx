"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (prev: { error?: string; success?: boolean } | undefined, formData: FormData) => Promise<{ error?: string; success?: boolean } | undefined>;
  next?: string;
  initialError?: string;
};

export function AuthForm({ mode, action, next = "/dashboard", initialError }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const displayError = state?.error ?? initialError;

  return (
    <Card className="w-full max-w-md border-neutral-200 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Log in to continue your challenge"
            : "Sign up to start the FIRST $500 challenge"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required placeholder="Your name" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
          </div>
          {displayError && (
            <p className="text-sm text-destructive">{displayError}</p>
          )}
          <Button type="submit" className="w-full bg-brand hover:bg-brand-hover" disabled={pending}>
            {pending ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
          {mode === "login" ? (
            <>
              <p>
                No account?{" "}
                <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-brand hover:underline">
                  Sign up
                </Link>
              </p>
              <Link href="/forgot-password" className="text-brand hover:underline">
                Forgot password?
              </Link>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-brand hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
