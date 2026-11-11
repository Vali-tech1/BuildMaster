import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { getAuthErrorMessage } from "@/lib/hyrja-offline";
import { lexoSesioniAktiv } from "@/lib/hyrja";
import { supabase, supabaseConfigError } from "@/lib/supabase";

type SesioniContextValue = {
  session: Session | null;
  loading: boolean;
  error: string | null;
};

const SesioniContext = createContext<SesioniContextValue | undefined>(undefined);

export function SesioniProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabase !== null);
  const [error, setError] = useState<string | null>(
    supabase ? null : supabaseConfigError ?? "Supabase nuk është konfiguruar.",
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;
    let authEventVersion = 0;
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      authEventVersion += 1;
      setSession(nextSession);
      setError(null);
      setLoading(false);
    });
    const initialVersion = authEventVersion;

    void lexoSesioniAktiv()
      .then((currentSession) => {
        if (active && authEventVersion === initialVersion) {
          setSession(currentSession);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active && authEventVersion === initialVersion) {
          setError(getAuthErrorMessage(cause));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <SesioniContext.Provider value={{ session, loading, error }}>
      {children}
    </SesioniContext.Provider>
  );
}

export function useSesioni(): SesioniContextValue {
  const context = useContext(SesioniContext);

  if (!context) {
    throw new Error("useSesioni duhet përdorur brenda SesioniProvider.");
  }

  return context;
}
