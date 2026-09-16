import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/server";
import { PRODUCT } from "@/config/product";

export default async function CheckoutCanceledPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Checkout canceled</CardTitle>
          <CardDescription>
            No worries — you were not charged. When you are ready, you can pick
            up where you left off.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {PRODUCT.name} is still available at {PRODUCT.displayPrice}.
          </p>
        </CardContent>
        <CardFooter>
          <Button render={<Link href="/checkout" />} nativeButton={false}>
            {PRODUCT.ctaPrimary}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
