import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function requireEntitlement() {
  const user = await requireAuth();
  const entitled = await hasActiveEntitlement(user.id, PRODUCT.key);
  if (!entitled) {
    redirect("/checkout");
  }
  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export function isDevBypassEntitlement(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS_ENTITLEMENT === "true"
  );
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export function safeRedirectPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  const blocked = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
  ];
  if (blocked.some((route) => path === route || path.startsWith(`${route}?`))) {
    return "/dashboard";
  }

  return path;
}
