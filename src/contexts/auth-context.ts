import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  error: null,
});
