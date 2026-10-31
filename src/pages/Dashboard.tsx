import { Link } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { InventoryStatus } from "@/components/InventoryStatus";
import { useInventory } from "@/hooks/use-inventory";
import { useAuth } from "@/hooks/use-auth";
import { summarizeInventory, daysUntilExpiry } from "@/lib/inventory";
import {
  Pill,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data, isPending, isError, refetch } = useInventory();
  const { session } = useAuth();
  if (isPending || isError)
    return <InventoryStatus error={isError} retry={() => refetch()} />;
  const { medicines, categoryCount, supplierCount } = data;
  const { lowStock, expiring, expired, categoryStock } =
    summarizeInventory(medicines);
  const name = session?.user.user_metadata.full_name || "";

  return (
    <div className="animate-fade-in space-y-6 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Selamat datang{name ? `, ${name}` : ""}. Berikut ringkasan
            inventaris apotek Anda.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-secondary">
          <Link to="/medicines">
            <Plus className="h-4 w-4" /> Kelola obat
          </Link>
        </Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total jenis obat"
          value={medicines.length}
          icon={Pill}
        />
        <StatsCard
          title="Stok menipis"
          value={lowStock.length}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Kategori"
          value={categoryCount}
          icon={Package}
          variant="success"
        />
        <StatsCard title="Pemasok" value={supplierCount} icon={Users} />
      </div>
      {!medicines.length && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <h2 className="text-xl font-semibold">
            Mulai dengan inventaris pertama Anda
          </h2>
          <p className="mb-4 mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tambahkan kategori dan pemasok, lalu masukkan data obat. Ringkasan,
            grafik, dan pengingat akan terisi dari data yang Anda simpan.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/categories">
                Tambah kategori <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/suppliers">Tambah pemasok</Link>
            </Button>
          </div>
        </Card>
      )}
      <Card className="border-border/50 p-6">
        <h2 className="text-lg font-semibold">Stok per kategori</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Jumlah unit obat berdasarkan inventaris saat ini.
        </p>
        {categoryStock.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryStock} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                name="Unit obat"
                dataKey="stock"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon={Package}
            title="Belum ada data stok"
            description="Grafik akan muncul setelah Anda menambahkan obat."
          />
        )}
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold">Stok perlu perhatian</h2>
          </div>
          {lowStock.length ? (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-warning/20 bg-warning/5 p-3"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.category || "Tanpa kategori"}
                    </p>
                  </div>
                  <Badge variant={m.stock === 0 ? "destructive" : "warning"}>
                    {m.stock} unit
                  </Badge>
                </div>
              ))}
              <Link
                to="/medicines"
                className="inline-block pt-2 text-sm font-medium text-primary"
              >
                Lihat inventaris →
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title={
                medicines.length
                  ? "Stok masih mencukupi"
                  : "Belum ada inventaris"
              }
              description="Obat dengan stok di bawah 10 unit akan ditampilkan di sini."
            />
          )}
        </Card>
        <Card className="border-border/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Mendekati kedaluwarsa</h2>
          </div>
          {expiring.length ? (
            <div className="space-y-3">
              {expiring.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        m.expirydate.slice(0, 10) + "T00:00:00",
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {daysUntilExpiry(m.expirydate)} hari
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="Belum ada obat mendekati kedaluwarsa"
              description="Obat yang kedaluwarsa dalam 90 hari akan ditampilkan di sini."
            />
          )}
          {expired.length > 0 && (
            <Link
              to="/notifications"
              className="mt-4 block rounded-lg bg-destructive/5 p-3 text-sm text-destructive"
            >
              {expired.length} jenis obat sudah kedaluwarsa. Lihat pengingat →
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
