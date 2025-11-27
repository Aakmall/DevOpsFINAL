import { Card } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full h-[300px]">
        {children}
      </div>
    </Card>
  );
};
