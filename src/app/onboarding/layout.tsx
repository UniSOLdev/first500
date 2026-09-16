import { requireEntitlement } from "@/lib/auth/server";

export default async function OnboardingLayout({
  children,
}: LayoutProps<"/onboarding">) {
  await requireEntitlement();
  return <>{children}</>;
}
