import type { InventoryMedicine } from "./inventory";

// Data tampilan lokal; tidak ditulis ke Supabase.
const categories = [
  { id: "preview-category-1", name: "Nyeri & Demam", color: "#14B8A6" },
  { id: "preview-category-2", name: "Alergi", color: "#8B5CF6" },
  { id: "preview-category-3", name: "Kesehatan Lambung", color: "#F59E0B" },
  { id: "preview-category-4", name: "Vitamin & Suplemen", color: "#3B82F6" },
];

export const previewMedicines: InventoryMedicine[] = [
  { id: "preview-medicine-1", name: "Paracetamol 500 mg", category: categories[0].name, supplier: null, stock: 120, price: 500, expirydate: "2027-08-31" },
  { id: "preview-medicine-2", name: "Ibuprofen 200 mg", category: categories[0].name, supplier: null, stock: 65, price: 1200, expirydate: "2027-06-30" },
  { id: "preview-medicine-3", name: "Asam Mefenamat 500 mg", category: categories[0].name, supplier: null, stock: 40, price: 1000, expirydate: "2027-09-30" },
  { id: "preview-medicine-4", name: "Cetirizine 10 mg", category: categories[1].name, supplier: null, stock: 48, price: 1500, expirydate: "2027-05-31" },
  { id: "preview-medicine-5", name: "Loratadine 10 mg", category: categories[1].name, supplier: null, stock: 32, price: 2000, expirydate: "2027-11-30" },
  { id: "preview-medicine-6", name: "Omeprazole 20 mg", category: categories[2].name, supplier: null, stock: 54, price: 1800, expirydate: "2027-07-31" },
  { id: "preview-medicine-7", name: "Antasida DOEN", category: categories[2].name, supplier: null, stock: 80, price: 700, expirydate: "2027-04-30" },
  { id: "preview-medicine-8", name: "Famotidine 20 mg", category: categories[2].name, supplier: null, stock: 8, price: 2500, expirydate: "2026-12-31" },
  { id: "preview-medicine-9", name: "Vitamin C 500 mg", category: categories[3].name, supplier: null, stock: 96, price: 1500, expirydate: "2028-01-31" },
  { id: "preview-medicine-10", name: "Vitamin B Kompleks", category: categories[3].name, supplier: null, stock: 72, price: 1000, expirydate: "2027-12-31" },
];

export const previewCategories = categories.map(category => ({
  ...category,
  medicineCount: previewMedicines.filter(medicine => medicine.category === category.name).length,
}));
