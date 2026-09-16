"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { saveDayProgress } from "@/app/(app)/challenge/actions";

type ResponsesContextValue = {
  savePartial: (partial: Record<string, unknown>) => void;
  getResponses: () => Record<string, unknown>;
  isSaving: boolean;
};

const ResponsesContext = createContext<ResponsesContextValue | null>(null);

export function DayResponsesProvider({
  dayNumber,
  initialResponses,
  children,
}: {
  dayNumber: number;
  initialResponses: Record<string, unknown>;
  children: ReactNode;
}) {
  const [isSaving, startTransition] = useTransition();
  const responsesRef = useRef<Record<string, unknown>>({
    ...initialResponses,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    (merged: Record<string, unknown>, silent?: boolean) => {
      startTransition(async () => {
        const result = await saveDayProgress(dayNumber, merged, "in_progress");
        if (!result.success && !silent) {
          toast.error(result.error ?? "Could not save progress");
        }
      });
    },
    [dayNumber]
  );

  const savePartial = useCallback(
    (partial: Record<string, unknown>) => {
      responsesRef.current = { ...responsesRef.current, ...partial };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        persist(responsesRef.current);
      }, 400);
    },
    [persist]
  );

  const getResponses = useCallback(() => responsesRef.current, []);

  return (
    <ResponsesContext.Provider value={{ savePartial, getResponses, isSaving }}>
      {children}
    </ResponsesContext.Provider>
  );
}

export function useDaySave() {
  const ctx = useContext(ResponsesContext);
  if (!ctx) {
    throw new Error("useDaySave must be used within DayResponsesProvider");
  }
  return ctx;
}
