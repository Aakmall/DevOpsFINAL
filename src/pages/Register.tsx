import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Loader2,
  Mail,
  MailCheck,
  UserRound,
} from "lucide-react";
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

export default function Register() {
  const { session, loading, error: sessionError } = useAuth();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (loading) return <SessionLoading />;
  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Gunakan kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi kata sandi belum sesuai.");
      return;
    }
    if (pending || !isSupabaseConfigured || isLocalPreview) return;
    setPending(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
      setPassword("");
      setConfirmation("");
      setSubmitted(true);
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (submitted)
    return (
      <AuthLayout>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Periksa email Anda
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Jika alamat{" "}
          <strong className="break-all text-foreground">{email}</strong> dapat
          didaftarkan, Anda akan menerima tautan verifikasi. Periksa juga folder
          spam, lalu masuk setelah email terverifikasi.
        </p>
        <Button
          asChild
          className="mt-8 h-12 bg-gradient-to-r from-primary to-secondary"
        >
          <Link to="/login" state={location.state}>
            Kembali ke login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Sudah memiliki akun dengan email ini? Anda bisa langsung masuk
          menggunakan akun sebelumnya.
        </p>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Mulai langkah baru
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Buat akun ApoSmart
      </h2>
      <p className="mb-7 mt-3 text-sm leading-relaxed text-muted-foreground">
        Siapkan ruang kerja Anda untuk pengelolaan apotek yang lebih mudah dan
        teratur.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Form register"
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
          <Label htmlFor="full-name">Nama lengkap</Label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="full-name"
              name="name"
              autoComplete="name"
              placeholder="Nama lengkap Anda"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-white pl-10"
            />
          </div>
        </div>
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
              required
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
            autoComplete="new-password"
            placeholder="Buat kata sandi"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-hint"
          />
          <p
            id="password-hint"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Check
              className={`h-3.5 w-3.5 ${password.length >= 8 ? "text-success" : ""}`}
            />{" "}
            Minimal 8 karakter
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi kata sandi</Label>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            required
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={pending || !isSupabaseConfigured || isLocalPreview}
          className="!mt-6 h-12 w-full bg-gradient-to-r from-primary to-secondary font-semibold shadow-lg shadow-primary/15 hover:opacity-90"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat akun...
            </>
          ) : (
            <>
              Buat akun <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </AuthLayout>
  );
}
