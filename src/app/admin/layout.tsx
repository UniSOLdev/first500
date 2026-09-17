import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAuth, isAdminEmail } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("/login?next=/admin");

  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Founder
            </p>
            <h1 className="text-lg font-semibold">Admin</h1>
          </div>
          <Link href="/dashboard" className="text-sm text-brand hover:underline">
            Back to app
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
