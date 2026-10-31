import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Pill,
  Package,
  Users,
  FileText,
  Bell,
  LogOut,
  Loader2,
} from "lucide-react";
import logo from "@/assets/aposmart-logo.png";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isLocalPreview } from "@/lib/preview";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Pill, label: "Medicines", href: "/medicines" },
  { icon: Package, label: "Categories", href: "/categories" },
  { icon: Users, label: "Suppliers", href: "/suppliers" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export const Sidebar = () => {
  const { session } = useAuth();
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  async function logout() {
    setPending(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
    } catch {
      toast({
        title: "Belum dapat keluar",
        description: "Periksa koneksi Anda lalu coba lagi.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border/50 bg-card p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-5 flex items-center gap-3 lg:mb-8">
        <img src={logo} alt="ApoSmart Logo" className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ApoSmart
          </h1>
          <p className="text-xs text-muted-foreground">Pharmacy Management</p>
        </div>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="flex gap-2 overflow-x-auto lg:block lg:space-y-2"
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap px-4 py-3 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4 lg:mt-auto lg:flex-col lg:items-stretch lg:pt-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {isLocalPreview
              ? "ApoSmart"
              : session?.user.user_metadata.full_name || "Akun apotek"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {isLocalPreview
              ? "Pharmacy Management"
              : session?.user.email}
          </p>
        </div>
        {isLocalPreview ? (
          <Button
            asChild
            variant="ghost"
            className="justify-start text-muted-foreground lg:mt-2"
          >
            <Link to="/login">Login</Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            disabled={pending}
            onClick={logout}
            className="justify-start text-muted-foreground lg:mt-2"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}{" "}
            Keluar
          </Button>
        )}
      </div>
    </aside>
  );
};
