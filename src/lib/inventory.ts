import { differenceInCalendarDays, parseISO } from "date-fns";

export interface InventoryMedicine {
  id: string;
  name: string;
  category: string | null;
  supplier: string | null;
  stock: number;
  price: number;
  expirydate: string | null;
}

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function daysUntilExpiry(expiry: string | null, today = new Date()) {
  if (!expiry) return null;
  const days = differenceInCalendarDays(parseISO(expiry.slice(0, 10)), today);
  return Number.isFinite(days) ? days : null;
}

export function summarizeInventory(
  medicines: InventoryMedicine[],
  today = new Date(),
) {
  const lowStock = medicines.filter((m) => m.stock < 10);
  const expiring = medicines
    .filter((m) => {
      const days = daysUntilExpiry(m.expirydate, today);
      return days !== null && days >= 0 && days <= 90;
    })
    .sort((a, b) => (a.expirydate || "").localeCompare(b.expirydate || ""));
  const expired = medicines.filter((m) => {
    const days = daysUntilExpiry(m.expirydate, today);
    return days !== null && days < 0;
  });
  const categories = new Map<
    string,
    { name: string; stock: number; value: number; medicines: number }
  >();
  for (const medicine of medicines) {
    const name = medicine.category || "Tanpa kategori";
    const group = categories.get(name) || {
      name,
      stock: 0,
      value: 0,
      medicines: 0,
    };
    group.stock += medicine.stock;
    group.value += medicine.stock * medicine.price;
    group.medicines += 1;
    categories.set(name, group);
  }
  return {
    lowStock,
    expiring,
    expired,
    totalStock: medicines.reduce((total, m) => total + m.stock, 0),
    stockValue: medicines.reduce((total, m) => total + m.stock * m.price, 0),
    categoryStock: [...categories.values()].sort((a, b) => b.stock - a.stock),
  };
}
