import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InventoryStatus({
  error,
  retry,
}: {
  error: boolean;
  retry: () => void;
}) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center"
      role={error ? "alert" : "status"}
    >
      {error ? (
        <>
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h2 className="text-xl font-semibold">Data belum dapat dimuat</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Periksa koneksi dan akses inventaris Anda. Data tidak ditampilkan
            sampai berhasil dimuat.
          </p>
          <Button onClick={retry} variant="outline">
            Coba lagi
          </Button>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat inventaris...</p>
        </>
      )}
    </div>
  );
}
