import test from "node:test";
import assert from "node:assert/strict";
import { daysUntilExpiry, summarizeInventory } from "../src/lib/inventory.ts";
import { authErrorMessage } from "../src/lib/auth-errors.ts";

const today = new Date(2026, 10, 1, 23, 59);
const medicine = (overrides = {}) => ({
  id: "test-only",
  name: "Test fixture",
  category: "A",
  supplier: null,
  stock: 10,
  price: 2500,
  expirydate: "2027-01-01",
  ...overrides,
});

test("empty inventory has no fabricated statistics or alerts", () => {
  const result = summarizeInventory([], today);
  assert.equal(result.totalStock, 0);
  assert.equal(result.stockValue, 0);
  assert.deepEqual(result.categoryStock, []);
  assert.deepEqual(result.lowStock, []);
  assert.deepEqual(result.expiring, []);
  assert.deepEqual(result.expired, []);
});

test("stock quantity and value aggregate separately from medicine counts", () => {
  const result = summarizeInventory(
    [
      medicine({ stock: 5, price: 2000 }),
      medicine({ stock: 20, price: 3000 }),
      medicine({ category: null, stock: 0 }),
    ],
    today,
  );
  assert.equal(result.totalStock, 25);
  assert.equal(result.stockValue, 70000);
  assert.deepEqual(result.categoryStock, [
    { name: "A", stock: 25, value: 70000, medicines: 2 },
    { name: "Tanpa kategori", stock: 0, value: 0, medicines: 1 },
  ]);
});

test("low stock includes zero and nine units, excludes ten", () => {
  const result = summarizeInventory(
    [
      medicine({ id: "zero", stock: 0 }),
      medicine({ id: "nine", stock: 9 }),
      medicine({ id: "ten", stock: 10 }),
    ],
    today,
  );
  assert.deepEqual(
    result.lowStock.map((m) => m.id),
    ["zero", "nine"],
  );
});

test("expiry compares calendar dates even at the end of the day", () => {
  assert.equal(daysUntilExpiry("2026-11-01", today), 0);
  assert.equal(daysUntilExpiry("2026-11-02", today), 1);
  assert.equal(daysUntilExpiry("2026-10-31", today), -1);
  assert.equal(daysUntilExpiry("2026-11-01T00:00:00+00:00", today), 0);
  assert.equal(daysUntilExpiry(null, today), null);
  assert.equal(daysUntilExpiry("invalid", today), null);
});

test("expiry alerts include today and day 90, separate expired medicines", () => {
  const result = summarizeInventory(
    [
      medicine({ id: "later", expirydate: "2027-01-31" }),
      medicine({ id: "boundary", expirydate: "2027-01-30" }),
      medicine({ id: "yesterday", expirydate: "2026-10-31" }),
      medicine({ id: "today", expirydate: "2026-11-01" }),
      medicine({ id: "unknown", expirydate: null }),
    ],
    today,
  );
  assert.deepEqual(
    result.expiring.map((m) => m.id),
    ["today", "boundary"],
  );
  assert.deepEqual(
    result.expired.map((m) => m.id),
    ["yesterday"],
  );
});

test("auth failures are actionable without exposing backend errors", () => {
  assert.match(
    authErrorMessage({ code: "invalid_credentials" }),
    /Email atau kata sandi/,
  );
  assert.match(
    authErrorMessage({ code: "email_not_confirmed" }),
    /belum diverifikasi/,
  );
  assert.match(
    authErrorMessage({ code: "over_email_send_rate_limit" }),
    /Terlalu banyak/,
  );
  assert.match(
    authErrorMessage(new Error("internal details")),
    /Periksa koneksi/,
  );
  assert.doesNotMatch(
    authErrorMessage(new Error("internal details")),
    /internal details/,
  );
});
