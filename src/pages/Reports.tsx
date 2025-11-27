import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", purchases: 45000000, sales: 85000000 },
  { month: "Feb", purchases: 38000000, sales: 72000000 },
  { month: "Mar", purchases: 52000000, sales: 95000000 },
  { month: "Apr", purchases: 48000000, sales: 88000000 },
  { month: "May", purchases: 55000000, sales: 102000000 },
  { month: "Jun", purchases: 60000000, sales: 115000000 },
];

const categoryData = [
  { name: "Pain Relief", value: 35, color: "#3B82F6" },
  { name: "Antibiotic", value: 25, color: "#10B981" },
  { name: "Supplement", value: 20, color: "#F59E0B" },
  { name: "Vitamin", value: 12, color: "#8B5CF6" },
  { name: "Others", value: 8, color: "#EC4899" },
];

const topMedicines = [
  { name: "Paracetamol 500mg", sales: 450, revenue: 2250000 },
  { name: "Amoxicillin 250mg", sales: 320, revenue: 3840000 },
  { name: "Vitamin C 1000mg", sales: 280, revenue: 2240000 },
  { name: "Ibuprofen 400mg", sales: 245, revenue: 1837500 },
  { name: "Cetirizine 10mg", sales: 210, revenue: 1680000 },
];

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: `Export ${type}`,
      description: `${type} export will be implemented with backend integration`,
    });
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">View sales, purchases, and inventory insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("PDF")}>
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("Excel")}>
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Total Sales</span>
          </div>
          <p className="text-3xl font-bold text-foreground">Rp 557M</p>
          <p className="text-sm text-success mt-1">↑ 12.5% from last month</p>
        </Card>

        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingDown className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Total Purchases</span>
          </div>
          <p className="text-3xl font-bold text-foreground">Rp 298M</p>
          <p className="text-sm text-muted-foreground mt-1">↑ 8.2% from last month</p>
        </Card>

        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Net Profit</span>
          </div>
          <p className="text-3xl font-bold text-foreground">Rp 259M</p>
          <p className="text-sm text-success mt-1">↑ 15.8% profit margin</p>
        </Card>

        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Items Sold</span>
          </div>
          <p className="text-3xl font-bold text-foreground">1,505</p>
          <p className="text-sm text-muted-foreground mt-1">Total transactions</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales vs Purchases</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar dataKey="purchases" fill="hsl(var(--warning))" name="Purchases" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sales" fill="hsl(var(--success))" name="Sales" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Selling Medicines</h3>
        <div className="space-y-3">
          {topMedicines.map((medicine, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Badge className="bg-primary text-primary-foreground">{index + 1}</Badge>
                <div>
                  <p className="font-medium text-foreground">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">{medicine.sales} units sold</p>
                </div>
              </div>
              <p className="font-semibold text-success">Rp {medicine.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
