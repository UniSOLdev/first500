import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevBypassEntitlement } from "@/lib/auth/server";
import { PRODUCT } from "@/config/product";
import type { Entitlement } from "@/types/database";

type EntitlementPurchaseRow = Pick<Entitlement, "id" | "purchased_at">;

function getAdminClient() {
  return createAdminClient() as SupabaseClient;
}

export async function hasActiveEntitlement(
  userId: string,
  productKey: string = PRODUCT.key
): Promise<boolean> {
  if (isDevBypassEntitlement()) return true;

  const supabase = await createClient();
  const { data } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("product_key", productKey)
    .eq("status", "active")
    .maybeSingle();

  return !!data;
}

export async function getEntitlementStatus(
  userId: string,
  productKey: string = PRODUCT.key
): Promise<{ active: boolean; purchasedAt: string | null }> {
  if (isDevBypassEntitlement()) {
    return { active: true, purchasedAt: new Date().toISOString() };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("entitlements")
    .select("id, purchased_at")
    .eq("user_id", userId)
    .eq("product_key", productKey)
    .eq("status", "active")
    .maybeSingle();

  const row = data as EntitlementPurchaseRow | null;

  return {
    active: !!row,
    purchasedAt: row?.purchased_at ?? null,
  };
}

export async function grantEntitlementFromCheckout(params: {
  userId: string;
  productKey: string;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string;
  purchasedAt: string;
}) {
  const admin = getAdminClient();

  const { data: existing } = await admin
    .from("entitlements")
    .select("id")
    .eq("stripe_checkout_session_id", params.stripeCheckoutSessionId)
    .maybeSingle();

  if (existing) return existing;

  const { data: activeEntitlement } = await admin
    .from("entitlements")
    .select("id")
    .eq("user_id", params.userId)
    .eq("product_key", params.productKey)
    .eq("status", "active")
    .maybeSingle();

  if (activeEntitlement) {
    await admin
      .from("entitlements")
      .update({
        stripe_customer_id: params.stripeCustomerId,
        stripe_checkout_session_id: params.stripeCheckoutSessionId,
        purchased_at: params.purchasedAt,
      })
      .eq("id", activeEntitlement.id);
    return activeEntitlement;
  }

  const { data, error } = await admin
    .from("entitlements")
    .insert({
      user_id: params.userId,
      product_key: params.productKey,
      status: "active",
      stripe_customer_id: params.stripeCustomerId,
      stripe_checkout_session_id: params.stripeCheckoutSessionId,
      purchased_at: params.purchasedAt,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
