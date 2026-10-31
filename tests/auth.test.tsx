import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const mocks = vi.hoisted(() => ({
  auth: { session: null, loading: false, error: null },
  preview: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  from: vi.fn(),
}));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => mocks.auth }));
vi.mock("@/lib/preview", () => ({
  get isLocalPreview() {
    return mocks.preview;
  },
}));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: { signInWithPassword: mocks.signIn, signUp: mocks.signUp },
    from: mocks.from,
  },
}));

afterEach(cleanup);
beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  mocks.auth = { session: null, loading: false, error: null };
  mocks.preview = false;
  mocks.signIn.mockReset();
  mocks.signUp.mockReset();
  mocks.from.mockReset();
});

function loginRoute(path = "/login") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Dashboard terbuka</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/reports" element={<h1>Laporan terbuka</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}
function registerRoute() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}
function fillRegister(password = "secure-pass", confirmation = password) {
  fireEvent.change(screen.getByLabelText("Nama lengkap"), {
    target: { value: "Nama Pengguna Uji" },
  });
  fireEvent.change(screen.getByLabelText("Alamat email"), {
    target: { value: "test@example.invalid" },
  });
  fireEvent.change(screen.getByLabelText("Kata sandi"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Konfirmasi kata sandi"), {
    target: { value: confirmation },
  });
}

describe("autentikasi", () => {
  it("mengalihkan pengunjung tanpa sesi dari laporan ke login", async () => {
    loginRoute("/reports");
    expect(
      await screen.findByRole("heading", { name: "Masuk ke ApoSmart" }),
    ).toBeTruthy();
    expect(screen.queryByText("Laporan terbuka")).toBeNull();
  });

  it("menahan halaman terlindungi selama sesi dimuat", () => {
    mocks.auth.loading = true;
    loginRoute("/reports");
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.queryByText("Laporan terbuka")).toBeNull();
  });

  it("tidak menampilkan formulir login kepada pengguna yang sudah masuk", async () => {
    mocks.auth.session = { user: { id: "test-user" } };
    loginRoute();
    expect(await screen.findByText("Dashboard terbuka")).toBeTruthy();
    expect(screen.queryByRole("form", { name: "Form login" })).toBeNull();
  });

  it("mengirim kredensial ke Supabase, menahan submit ganda, dan menampilkan kegagalan", async () => {
    let finish: (value: unknown) => void;
    mocks.signIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    loginRoute();
    fireEvent.change(screen.getByLabelText("Alamat email"), {
      target: { value: "test@example.invalid" },
    });
    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: { value: " password-with-spaces " },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Form login" }));
    expect(mocks.signIn).toHaveBeenCalledWith({
      email: "test@example.invalid",
      password: " password-with-spaces ",
    });
    expect(
      (
        screen.getByRole("button", {
          name: /Sedang masuk/,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    fireEvent.submit(screen.getByRole("form", { name: "Form login" }));
    expect(mocks.signIn).toHaveBeenCalledTimes(1);
    finish({ error: { code: "invalid_credentials" } });
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Email atau kata sandi tidak sesuai",
    );
  });

  it("menolak konfirmasi kata sandi berbeda sebelum menghubungi server", () => {
    registerRoute();
    fillRegister("secure-pass", "different-pass");
    fireEvent.submit(screen.getByRole("form", { name: "Form register" }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Konfirmasi kata sandi belum sesuai",
    );
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("mengirim nama sebagai metadata dan meminta verifikasi tanpa membuat sesi palsu", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null });
    registerRoute();
    fillRegister();
    fireEvent.submit(screen.getByRole("form", { name: "Form register" }));
    expect(
      await screen.findByRole("heading", { name: "Periksa email Anda" }),
    ).toBeTruthy();
    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "test@example.invalid",
      password: "secure-pass",
      options: {
        data: { full_name: "Nama Pengguna Uji" },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    expect(mocks.auth.session).toBeNull();
  });

  it("mengizinkan pratinjau tanpa sesi dan tanpa membuka akses autentikasi", async () => {
    mocks.preview = true;
    loginRoute("/reports");
    expect(await screen.findByText("Laporan terbuka")).toBeTruthy();
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("membuka dashboard lewat tombol Masuk tanpa kredensial atau request autentikasi lokal", async () => {
    mocks.preview = true;
    const view = loginRoute();
    expect(
      (screen.getByRole("button", { name: /^Masuk$/ }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /^Masuk$/ }));
    expect(await screen.findByText("Dashboard terbuka")).toBeTruthy();
    expect(mocks.signIn).not.toHaveBeenCalled();
    view.unmount();
    registerRoute();
    fillRegister();
    fireEvent.submit(screen.getByRole("form", { name: "Form register" }));
    expect(
      (screen.getByRole("button", { name: "Buat akun" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("menampilkan 10 obat dan 4 kategori tanpa pemasok atau request database dalam pratinjau", async () => {
    mocks.preview = true;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(screen.getByText("Total jenis obat").parentElement?.textContent).toContain("10"));
    expect(screen.getByText("Kategori").parentElement?.textContent).toContain("4");
    expect(screen.getByText("Pemasok").parentElement?.textContent).toContain("0");
    expect(screen.queryByText("Mulai dengan inventaris pertama Anda")).toBeNull();
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
