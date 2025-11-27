import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Pill, Package, Users, FileText, Bell } from "lucide-react";
import logo from "@/assets/aposmart-logo.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Pill, label: "Medicines", href: "/medicines" },
  { icon: Package, label: "Categories", href: "/categories" },
  { icon: Users, label: "Suppliers", href: "/suppliers" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border/50 p-6">
      <div className="mb-8 flex items-center gap-3">
        <img src={logo} alt="ApoSmart Logo" className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ApoSmart
          </h1>
          <p className="text-xs text-muted-foreground">Pharmacy Management</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
