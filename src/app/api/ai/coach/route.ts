import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser, isDevBypassEntitlement } from "@/lib/auth/server";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { trackServer } from "@/lib/analytics";
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
          error: `Rate limit exceeded. Try again in ${formatRetryAfter(rateLimit.retryAfterMs)}.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
          },
        }
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

    trackServer("ai_coach_used", {
      quickAction: quickAction ?? "",
      dayNumber: coachContext.currentDay ?? 0,
    });

    return NextResponse.json({
      reply: assistantReply,
      quickAction: quickAction ?? null,
    });
  } catch (error) {
    console.error("[ai/coach] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
