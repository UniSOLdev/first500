"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CoachContext } from "@/lib/integration/contracts";
import { CoachPanel } from "@/components/coach/coach-panel";

type CoachContextValue = {
  context: CoachContext;
  setContext: (partial: Partial<CoachContext>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  openCoach: () => void;
  closeCoach: () => void;
};

const CoachUiContext = createContext<CoachContextValue | null>(null);

export type CoachProviderProps = {
  children: ReactNode;
  initialContext?: CoachContext;
};

export function CoachProvider({ children, initialContext }: CoachProviderProps) {
  const [context, setContextState] = useState<CoachContext>(
    initialContext ?? {}
  );
  const [open, setOpen] = useState(false);

  const setContext = useCallback((partial: Partial<CoachContext>) => {
    setContextState((current) => ({ ...current, ...partial }));
  }, []);

  const openCoach = useCallback(() => setOpen(true), []);
  const closeCoach = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      context,
      setContext,
      open,
      setOpen,
      openCoach,
      closeCoach,
    }),
    [context, open, setContext, openCoach, closeCoach]
  );

  return (
    <CoachUiContext.Provider value={value}>
      {children}
      <CoachPanel />
    </CoachUiContext.Provider>
  );
}

export function useCoach() {
  const value = useContext(CoachUiContext);
  if (!value) {
    throw new Error("useCoach must be used within CoachProvider");
  }
  return value;
}
