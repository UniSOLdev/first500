import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_LIMIT = 100;

export function getAiMessageLimit(): number {
  const raw = process.env.AI_MESSAGE_LIMIT?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_LIMIT;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
}

export async function getAiUsage(userId: string): Promise<number> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("ai_usage")
      .select("message_count")
      .eq("user_id", userId)
      .maybeSingle();

    return data?.message_count ?? 0;
  } catch {
    // Fallback: count user messages in conversations if ai_usage unavailable
    try {
      const admin = createAdminClient();
      const { count } = await admin
        .from("ai_conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "user");
      return count ?? 0;
    } catch {
      return 0;
    }
  }
}

export async function incrementAiUsage(userId: string): Promise<number> {
  const admin = createAdminClient();
  const current = await getAiUsage(userId);
  const next = current + 1;

  const { error } = await admin.from("ai_usage").upsert(
    {
      user_id: userId,
      message_count: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[ai/usage] upsert failed:", error);
  }

  return next;
}

export async function checkAiMessageLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}> {
  const limit = getAiMessageLimit();
  const used = await getAiUsage(userId);
  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    used,
    limit,
    remaining,
  };
}
