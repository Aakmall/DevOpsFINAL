import {
  FileDown,
  Package,
  Wallet,
  PieChart as PieChartIcon,
  Pill,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/EmptyState";
import { InventoryStatus } from "@/components/InventoryStatus";
import { useInventory } from "@/hooks/use-inventory";
import { formatRupiah, summarizeInventory } from "@/lib/inventory";

export default function Reports() {
  const { data, isPending, isError, refetch } = useInventory();
  if (isPending || isError)
    return <InventoryStatus error={isError} retry={() => refetch()} />;
  const { medicines, categoryCount } = data;
  const { totalStock, stockValue, categoryStock } =
    summarizeInventory(medicines);

  function exportInventory() {
    const cell = (value: unknown) => {
      const text = String(value ?? "");
      // Prevent spreadsheet programs from interpreting user input as formulas.
      return `"${(/^[=+\-@\t\r\n]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
    };
    const rows = [
      [
        "Nama obat",
        "Kategori",
        "Pemasok",
        "Stok",
        "Harga satuan",
        "Nilai stok",
        "Kedaluwarsa",
      ],
      ...medicines.map((m) => [
        m.name,
        m.category,
        m.supplier,
        m.stock,
        m.price,
        m.stock * m.price,
        m.expirydate,
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8;" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `aposmart-inventaris-${new Date().toLocaleDateString("sv-SE")}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="animate-fade-in space-y-6 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Laporan inventaris</h1>
          <p className="mt-2 text-muted-foreground">
            Ringkasan berdasarkan data obat yang tersimpan saat ini.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportInventory}
          disabled={!medicines.length}
        >
          <FileDown className="h-4 w-4" /> Ekspor CSV
        </Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Jenis obat" value={medicines.length} icon={Pill} />
        <StatsCard
          title="Total unit stok"
          value={totalStock.toLocaleString("id-ID")}
          icon={Package}
        />
        <StatsCard
          title="Kategori"
          value={categoryCount}
          icon={PieChartIcon}
          variant="success"
        />
        <StatsCard
          title="Nilai persediaan"
          value={formatRupiah(stockValue)}
          icon={Wallet}
        />
      </div>
      <Card className="border-border/50 p-6">
        <h2 className="text-lg font-semibold">Distribusi stok</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Jumlah unit pada setiap kategori obat.
        </p>
        {categoryStock.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStock}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="stock"
                name="Unit obat"
                fill="hsl(var(--secondary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon={PieChartIcon}
            title="Belum ada data untuk dianalisis"
            description="Tambahkan inventaris obat untuk melihat distribusi stok dan nilai persediaan."
          />
        )}
      </Card>
      <Card className="overflow-hidden border-border/50">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Rincian per kategori</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nilai persediaan dihitung dari stok × harga satuan yang tercatat.
          </p>
        </div>
        {categoryStock.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Kategori</th>
                  <th className="px-6 py-3 font-medium">Jenis obat</th>
                  <th className="px-6 py-3 font-medium">Unit stok</th>
                  <th className="px-6 py-3 text-right font-medium">
                    Nilai persediaan
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryStock.map((c) => (
                  <tr key={c.name} className="border-t">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4">{c.medicines}</td>
                    <td className="px-6 py-4">{c.stock}</td>
                    <td className="px-6 py-4 text-right">
                      {formatRupiah(c.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="Belum ada rincian inventaris"
            description="Rincian kategori akan mengikuti data obat yang Anda simpan."
          />
        )}
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Laporan ini menunjukkan kondisi inventaris saat ini. Data penjualan,
        pembelian, dan laba belum tersedia karena pencatatan transaksi belum
        terhubung.
      </p>
    </div>
  );
}
