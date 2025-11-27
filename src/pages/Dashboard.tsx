import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Package, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const stockData = [
  { name: "Jan", stock: 400 },
  { name: "Feb", stock: 300 },
  { name: "Mar", stock: 600 },
  { name: "Apr", stock: 800 },
  { name: "May", stock: 500 },
  { name: "Jun", stock: 700 },
];

const salesData = [
  { name: "Mon", sales: 120 },
  { name: "Tue", sales: 180 },
  { name: "Wed", sales: 150 },
  { name: "Thu", sales: 220 },
  { name: "Fri", sales: 280 },
  { name: "Sat", sales: 350 },
  { name: "Sun", sales: 200 },
];

const lowStockMedicines = [
  { name: "Paracetamol 500mg", stock: 5, category: "Pain Relief" },
  { name: "Amoxicillin 250mg", stock: 3, category: "Antibiotic" },
  { name: "Vitamin C 1000mg", stock: 8, category: "Supplement" },
];

const expiringMedicines = [
  { name: "Ibuprofen 400mg", expiryDate: "2025-12-15", daysLeft: 27 },
  { name: "Cetirizine 10mg", expiryDate: "2025-12-20", daysLeft: 32 },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your pharmacy Dashboard overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Medicines"
          value="1,234"
          icon={Pill}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value="23"
          icon={AlertTriangle}
          variant="warning"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Total Categories"
          value="45"
          icon={Package}
          variant="success"
        />
        <StatsCard
          title="Monthly Sales"
          value="Rp 45.2M"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock Overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
              />
              <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Sales">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--secondary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Low Stock Medicines</h3>
          </div>
          <div className="space-y-3">
            {lowStockMedicines.map((medicine, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">{medicine.category}</p>
                </div>
                <Badge variant="warning">
                  {medicine.stock} left
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Expiring Soon</h3>
          </div>
          <div className="space-y-3">
            {expiringMedicines.map((medicine, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">Expires: {medicine.expiryDate}</p>
                </div>
                <Badge variant="outline" className="border-accent/50 text-accent">
                  {medicine.daysLeft} days
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
