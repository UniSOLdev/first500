import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEntitlementStatus } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getEntitlementStatus(user.id, PRODUCT.key);
  return NextResponse.json(status);
}
