import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("tidak mengizinkan bypass login pada build produksi meskipun flag aktif", async () => {
  vi.stubEnv("DEV", false);
  vi.stubEnv("VITE_LOCAL_PREVIEW", "true");
  const { isLocalPreview } = await import("@/lib/preview");
  expect(isLocalPreview).toBe(false);
});

it("mengaktifkan pratinjau hanya ketika development dan flag keduanya aktif", async () => {
  vi.stubEnv("DEV", true);
  vi.stubEnv("VITE_LOCAL_PREVIEW", "true");
  const { isLocalPreview } = await import("@/lib/preview");
  expect(isLocalPreview).toBe(true);
});

it("tetap memerlukan login dalam development saat flag dinonaktifkan", async () => {
  vi.stubEnv("DEV", true);
  vi.stubEnv("VITE_LOCAL_PREVIEW", "false");
  const { isLocalPreview } = await import("@/lib/preview");
  expect(isLocalPreview).toBe(false);
});
