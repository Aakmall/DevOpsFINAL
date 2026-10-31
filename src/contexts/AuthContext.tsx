import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { AuthContext, type AuthState } from "./auth-context";
import { isLocalPreview } from "@/lib/preview";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    error: null,
  });
  const queryClient = useQueryClient();
  const userId = useRef<string | null>(null);

  useEffect(() => {
    if (isLocalPreview) {
      setState({ session: null, loading: false, error: null });
      return;
    }
    if (!isSupabaseConfigured) {
      setState({
        session: null,
        loading: false,
        error: "Layanan akun belum dikonfigurasi. Hubungi pengelola aplikasi.",
      });
      return;
    }

    let active = true;
    let authEventReceived = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      if (active) {
        if (
          userId.current !== (session?.user.id || null) ||
          _event === "SIGNED_OUT"
        )
          queryClient.clear();
        userId.current = session?.user.id || null;
        setState({ session, loading: false, error: null });
      }
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (active && !authEventReceived) {
          setState({
            session: data.session,
            loading: false,
            error: error
              ? "Sesi tidak dapat dimuat. Silakan masuk kembali."
              : null,
          });
        }
      })
      .catch(() => {
        if (active && !authEventReceived) {
          setState({
            session: null,
            loading: false,
            error:
              "Tidak dapat menghubungi layanan akun. Periksa koneksi Anda.",
          });
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
