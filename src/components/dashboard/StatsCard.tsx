import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "warning" | "success";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  return (
    <Card className={cn(
      "p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer",
      "border-border/50 bg-card/80 backdrop-blur-sm",
      variant === "warning" && "border-warning/30 bg-warning/5",
      variant === "success" && "border-success/30 bg-success/5"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2 font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "success" && "bg-success/10 text-success"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
