import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SessionLoading } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { authErrorMessage } from "@/lib/auth-errors";
import { isLocalPreview } from "@/lib/preview";

export default function Login() {
  const { session, loading, error: sessionError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedPath = location.state?.from;
  const destination =
    typeof requestedPath === "string" &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !/^\/(login|register)(\/|\?|$)/.test(requestedPath)
      ? requestedPath
      : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <SessionLoading />;
  if (session) return <Navigate to={destination} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (isLocalPreview) {
      navigate(destination, { replace: true });
      return;
    }
    if (!isSupabaseConfigured) return;
    setPending(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate(destination, { replace: true });
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Selamat datang kembali
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Masuk ke ApoSmart
      </h2>
      <p className="mb-8 mt-3 text-sm leading-relaxed text-muted-foreground">
        Apotek yang teratur dimulai dari sini. Masuk untuk mengelola aktivitas
        apotek Anda.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        aria-label="Form login"
        noValidate={isLocalPreview}
      >
        {(error || sessionError) && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {error || sessionError}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Alamat email</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email Anda"
              required={!isLocalPreview}
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Kata sandi</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            required={!isLocalPreview}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={pending || (!isLocalPreview && !isSupabaseConfigured)}
          className="h-12 w-full bg-gradient-to-r from-primary to-secondary font-semibold shadow-lg shadow-primary/15 hover:opacity-90"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang masuk...
            </>
          ) : (
            <>
              Masuk <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
      <div className="mt-9 border-t pt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Kelola inventaris, pantau stok, dan atur pemasok
        <br />
        dalam satu ruang kerja.
      </div>
    </AuthLayout>
  );
}
