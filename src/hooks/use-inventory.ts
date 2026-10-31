import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { InventoryMedicine } from "@/lib/inventory";
import { isLocalPreview } from "@/lib/preview";
import { previewMedicines, previewCategories } from "@/lib/preview-data";

export function useInventory() {
  const { session } = useAuth();
  return useQuery({
    queryKey: [
      "inventory",
      isLocalPreview ? "local-preview" : session?.user.id,
    ],
    enabled: isLocalPreview || Boolean(session),
    queryFn: async ({ signal }) => {
      if (isLocalPreview)
        return {
          medicines: previewMedicines,
          categoryCount: previewCategories.length,
          supplierCount: 0,
        };
      const [categories, suppliers] = await Promise.all([
        supabase
          .from("categories")
          .select("id", { count: "exact", head: true })
          .abortSignal(signal),
        supabase
          .from("suppliers")
          .select("id", { count: "exact", head: true })
          .abortSignal(signal),
      ]);
      if (categories.error) throw categories.error;
      if (suppliers.error) throw suppliers.error;
      const medicines: InventoryMedicine[] = [];
      const pageSize = 500;
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await supabase
          .from("medicines")
          .select("id,name,category,supplier,stock,price,expirydate")
          .order("id")
          .range(offset, offset + pageSize - 1)
          .abortSignal(signal);
        if (error) throw error;
        medicines.push(
          ...data.map((m) => ({
            ...m,
            stock: Number(m.stock),
            price: Number(m.price),
          })),
        );
        if (data.length < pageSize) break;
      }
      return {
        medicines,
        categoryCount: categories.count || 0,
        supplierCount: suppliers.count || 0,
      };
    },
    staleTime: 0,
    retry: 1,
  });
}
