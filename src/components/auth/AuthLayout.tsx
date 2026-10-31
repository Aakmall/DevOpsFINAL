import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BellRing,
  Check,
  HeartPulse,
  PackageCheck,
  Pill,
  ShieldCheck,
} from "lucide-react";
import logo from "@/assets/aposmart-logo.png";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <section className="auth-story relative hidden overflow-hidden bg-[hsl(178_62%_16%)] px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-2xl bg-white p-2">
            <img src={logo} alt="" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">
              ApoSmart<span className="text-[hsl(163_64%_64%)]">.</span>
            </p>
            <p className="text-xs tracking-wide text-white/60">
              Pharmacy Management · dolphine group
            </p>
            <p className="mt-1 text-xs font-medium tracking-wide text-[hsl(163_64%_64%)]">
              DevOpsFinal
            </p>
          </div>
        </div>

        <div className="relative z-10 my-auto py-14">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80">
            <HeartPulse className="h-3.5 w-3.5 text-[hsl(163_64%_64%)]" /> Ruang
            kerja apotek Anda
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.15] tracking-tight xl:text-[3.5rem]">
            Kelola lebih mudah.
            <br />
            <span className="text-[hsl(163_64%_64%)]">Layani lebih baik.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/65">
            Dari stok obat hingga pemasok, semua terhubung dalam satu tempat.
            Lebih teratur, lebih fokus pada pelayanan.
          </p>

          <div className="relative mt-10 max-w-md rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Pill className="h-4 w-4" />
                </span>{" "}
                Inventaris dalam kendali
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/50" />
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: PackageCheck,
                  label: "Stok & kategori obat",
                  detail: "Tertata dalam satu tempat",
                },
                {
                  icon: BellRing,
                  label: "Pengingat kedaluwarsa",
                  detail: "Pantau obat yang perlu perhatian",
                },
              ].map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                >
                  <Icon className="h-5 w-5 shrink-0 text-[hsl(163_64%_64%)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-0.5 text-xs text-white/50">{detail}</p>
                  </div>
                  <Check className="h-4 w-4 text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/55">
          <ShieldCheck className="h-4 w-4" /> Satu langkah menuju apotek yang
          lebih terorganisir.
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-10">
        <div className="flex items-center gap-2.5 lg:hidden">
          <img src={logo} alt="" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-xl font-bold text-foreground">
              ApoSmart<span className="text-primary">.</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Pharmacy Management · dolphine group
            </p>
            <p className="mt-1 text-xs font-medium text-primary">DevOpsFinal</p>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[410px] flex-1 flex-col justify-center py-10">
          {children}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ApoSmart. Lebih rapi, lebih siap
          melayani.
        </p>
      </section>
    </main>
  );
}
