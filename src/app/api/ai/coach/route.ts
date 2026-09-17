import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser, isDevBypassEntitlement } from "@/lib/auth/server";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { trackServer } from "@/lib/analytics";
import {
  checkAiMessageLimit,
  getAiMessageLimit,
  incrementAiUsage,
} from "@/lib/ai/usage-limit";
import {
  checkRateLimit,
  formatRetryAfter,
} from "@/lib/ai/rate-limit";
import {
  COACH_SYSTEM_PROMPT,
  getOpenAI,
  getOpenAIModel,
} from "@/lib/openai/client";
import {
  buildCoachContextString,
  loadCoachContext,
} from "@/lib/openai/coach-context";
import { QUICK_ACTION_KEYS, QUICK_ACTIONS } from "@/lib/openai/quick-actions";
import { createClient } from "@/lib/supabase/server";
import type { AiConversation } from "@/types/database";

const coachRequestSchema = z
  .object({
    message: z.string().trim().max(2000).optional(),
    quickAction: z.enum(QUICK_ACTION_KEYS).optional(),
    dayNumber: z.number().int().min(1).max(7).optional(),
  })
  .refine((data) => Boolean(data.message || data.quickAction), {
    message: "Either message or quickAction is required",
  });

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitled =
      isDevBypassEntitlement() ||
      (await hasActiveEntitlement(user.id));
    if (!entitled) {
      return NextResponse.json(
        { error: "Active entitlement required" },
        { status: 403 }
      );
    }

    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `You're sending messages quickly. Try again in ${formatRetryAfter(rateLimit.retryAfterMs)}.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
          },
        }
      );
    }

    const usage = await checkAiMessageLimit(user.id);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: `You've used all ${getAiMessageLimit()} AI coach messages included with your purchase. Focus on applying what you've learned in the challenge days.`,
          usage: { used: usage.used, limit: usage.limit, remaining: 0 },
        },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = coachRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, quickAction, dayNumber } = parsed.data;
    const userInput = quickAction
      ? QUICK_ACTIONS[quickAction].prompt
      : message!;

    const supabase = await createClient();
    const coachContext = await loadCoachContext(supabase, user.id, dayNumber);
    const contextString = buildCoachContextString(coachContext);

    let assistantReply: string;
    try {
      const openai = getOpenAI();
      const response = await openai.responses.create({
        model: getOpenAIModel(),
        instructions: `${COACH_SYSTEM_PROMPT}\n\n${contextString}`,
        input: userInput,
        max_output_tokens: 800,
      });
      assistantReply = response.output_text?.trim() ?? "";
      if (!assistantReply) {
        throw new Error("Empty model response");
      }
    } catch (error) {
      console.error("[ai/coach] OpenAI error:", error);
      return NextResponse.json(
        { error: "Coach is temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    await incrementAiUsage(user.id);

    const userContent = quickAction
      ? `[${QUICK_ACTIONS[quickAction].label}] ${userInput}`
      : userInput;

    const conversationRows: Array<
      Pick<AiConversation, "user_id" | "role" | "content">
    > = [
      { user_id: user.id, role: "user", content: userContent },
      { user_id: user.id, role: "assistant", content: assistantReply },
    ];

    const { error: insertError } = await supabase
      .from("ai_conversations")
      .insert(conversationRows as never);

    if (insertError) {
      console.error("[ai/coach] Failed to persist conversation:", insertError);
    }

    trackServer(
      "ai_coach_used",
      {
        quickAction: quickAction ?? "",
        dayNumber: coachContext.currentDay ?? 0,
      },
      user.id
    );

    const updatedUsage = await checkAiMessageLimit(user.id);

    return NextResponse.json({
      reply: assistantReply,
      quickAction: quickAction ?? null,
      usage: {
        used: updatedUsage.used,
        limit: updatedUsage.limit,
        remaining: updatedUsage.remaining,
      },
    });
  } catch (error) {
    console.error("[ai/coach] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
