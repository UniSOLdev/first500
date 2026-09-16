"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCoach } from "@/components/coach/coach-provider";
import {
  QUICK_ACTIONS,
  type QuickActionKey,
} from "@/lib/openai/quick-actions";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function CoachPanel() {
  const { context, open, setOpen, openCoach } = useCoach();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (payload: {
      message?: string;
      quickAction?: QuickActionKey;
    }) => {
      const trimmed = payload.message?.trim();
      if (!trimmed && !payload.quickAction) return;

      setError(null);
      setLoading(true);

      const userLabel = payload.quickAction
        ? QUICK_ACTIONS[payload.quickAction].label
        : trimmed!;
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userLabel,
      };
      setMessages((current) => [...current, userMessage]);
      if (trimmed) setInput("");

      try {
        const response = await fetch("/api/ai/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            quickAction: payload.quickAction,
            dayNumber: context.currentDay,
          }),
        });

        const data = (await response.json()) as {
          reply?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Coach request failed");
        }

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.reply ?? "No response received.",
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        textareaRef.current?.focus();
      }
    },
    [context.currentDay]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    void sendMessage({ message: input });
  };

  return (
    <>
      <Button
        type="button"
        onClick={openCoach}
        className="fixed bottom-5 right-5 z-40 gap-2 shadow-lg"
        size="lg"
      >
        <MessageCircle className="size-4" />
        Ask My Business Coach
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={cn(
            "flex w-full flex-col gap-0 p-0",
            isMobile
              ? "inset-0 h-dvh max-h-dvh w-full max-w-none rounded-none border-0 sm:max-w-none"
              : "sm:max-w-md"
          )}
        >
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle>Business Coach</SheetTitle>
            <SheetDescription>
              Practical help for your local service business — grounded in your
              challenge progress.
            </SheetDescription>
          </SheetHeader>

          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && !loading && (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Ask a question or pick a quick action to get started. Your
                service, market, and challenge work are included as context.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[92%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto border border-border bg-card text-card-foreground"
                )}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Coach is thinking...
              </div>
            )}
          </div>

          <div className="border-t px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {(Object.entries(QUICK_ACTIONS) as [QuickActionKey, (typeof QUICK_ACTIONS)[QuickActionKey]][]).map(
                ([key, action]) => (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    size="xs"
                    disabled={loading}
                    onClick={() => void sendMessage({ quickAction: key })}
                  >
                    {action.label}
                  </Button>
                )
              )}
            </div>

            {error && (
              <p className="mb-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask your coach anything..."
                maxLength={2000}
                rows={2}
                disabled={loading}
                className="min-h-0 flex-1 resize-none"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (!loading && input.trim()) {
                      void sendMessage({ message: input });
                    }
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <SendHorizontal className="size-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
