import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Clock,
  X,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { InventoryStatus } from "@/components/InventoryStatus";
import { useInventory } from "@/hooks/use-inventory";
import { useAuth } from "@/hooks/use-auth";
import { daysUntilExpiry } from "@/lib/inventory";

interface Preferences {
  read: string[];
  dismissed: string[];
}

export default function Notifications() {
  const { session } = useAuth();
  const key = `aposmart:alerts:${session?.user.id}`;
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      return {
        read: Array.isArray(saved?.read) ? saved.read : [],
        dismissed: Array.isArray(saved?.dismissed) ? saved.dismissed : [],
      };
    } catch {
      return { read: [], dismissed: [] };
    }
  });
  const { data, isPending, isError, refetch } = useInventory();
  if (isPending || isError)
    return <InventoryStatus error={isError} retry={() => refetch()} />;
  const notifications = data.medicines
    .flatMap((m) => {
      const alerts: {
        id: string;
        title: string;
        message: string;
        type: "low_stock" | "expired" | "expiring";
      }[] = [];
      if (m.stock < 10)
        alerts.push({
          id: `${m.id}:stock:${m.stock}`,
          title: m.stock === 0 ? "Stok habis" : "Stok menipis",
          message: `${m.name} memiliki sisa stok ${m.stock} unit.`,
          type: "low_stock",
        });
      const days = daysUntilExpiry(m.expirydate);
      if (days !== null && days <= 90)
        alerts.push({
          id: `${m.id}:${days < 0 ? "expired" : "expiring"}:${m.expirydate}`,
          title: days < 0 ? "Obat kedaluwarsa" : "Mendekati kedaluwarsa",
          message: `${m.name} ${days < 0 ? "sudah kedaluwarsa" : days === 0 ? "kedaluwarsa hari ini" : `akan kedaluwarsa dalam ${days} hari`}.`,
          type: days < 0 ? "expired" : "expiring",
        });
      return alerts;
    })
    .filter((n) => !preferences.dismissed.includes(n.id));
  const unreadCount = notifications.filter(
    (n) => !preferences.read.includes(n.id),
  ).length;

  function save(next: Preferences) {
    setPreferences(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Preferences still work for this visit when browser storage is unavailable. */
    }
  }

  return (
    <div className="animate-fade-in space-y-6 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Notifikasi</h1>
          <p className="mt-2 text-muted-foreground">
            Pengingat otomatis dari stok dan tanggal kedaluwarsa inventaris
            Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="warning">{unreadCount} belum dibaca</Badge>
          )}
          <Button
            variant="outline"
            disabled={!unreadCount}
            onClick={() =>
              save({
                ...preferences,
                read: [
                  ...new Set([
                    ...preferences.read,
                    ...notifications.map((n) => n.id),
                  ]),
                ],
              })
            }
          >
            <CheckCheck className="h-4 w-4" /> Tandai semua dibaca
          </Button>
        </div>
      </div>
      {!notifications.length ? (
        <Card>
          <EmptyState
            icon={Bell}
            title="Tidak ada notifikasi"
            description="Pengingat muncul saat stok di bawah 10 unit atau obat memasuki 90 hari sebelum kedaluwarsa."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const read = preferences.read.includes(n.id);
            const Icon =
              n.type === "expired"
                ? XCircle
                : n.type === "expiring"
                  ? Clock
                  : AlertTriangle;
            return (
              <Card
                key={n.id}
                className={`flex items-start gap-4 p-5 ${read ? "" : "border-primary/20 bg-primary/5"}`}
              >
                <div
                  className={`rounded-xl p-3 ${n.type === "expired" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{n.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {n.message}
                  </p>
                  {!read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2"
                      onClick={() =>
                        save({
                          ...preferences,
                          read: [...preferences.read, n.id],
                        })
                      }
                    >
                      Tandai dibaca
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Tutup notifikasi ${n.title}`}
                  onClick={() =>
                    save({
                      ...preferences,
                      dismissed: [...preferences.dismissed, n.id],
                    })
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Status dibaca dan notifikasi yang ditutup disimpan pada browser ini
        untuk akun Anda.
      </p>
    </div>
  );
}
