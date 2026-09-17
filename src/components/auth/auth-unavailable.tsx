import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupportEmail } from "@/lib/support";

export function AuthUnavailable() {
  const supportEmail = getSupportEmail();

  return (
    <Card className="w-full max-w-md border-destructive/30 shadow-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <CardTitle className="text-xl">Sign-in temporarily unavailable</CardTitle>
        <CardDescription>
          We&apos;re having trouble connecting to our authentication service. This is
          usually resolved quickly.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground space-y-3">
        <p>Please refresh the page and try again in a few minutes.</p>
        <p>
          Need help? Email{" "}
          <a href={`mailto:${supportEmail}`} className="text-brand hover:underline">
            {supportEmail}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
