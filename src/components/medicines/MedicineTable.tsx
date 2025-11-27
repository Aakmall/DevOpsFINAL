import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  supplier: string;
}

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (medicine: Medicine) => void;
}

export const MedicineTable = ({ medicines, onEdit, onDelete, onQuickAdd }: MedicineTableProps) => {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="font-semibold">Medicine Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Stock</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">Expiry Date</TableHead>
            <TableHead className="font-semibold">Supplier</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.stock);
            return (
              <TableRow 
                key={medicine.id}
                className="hover:bg-muted/50 transition-colors border-border/30"
              >
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {medicine.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={stockStatus.variant}>
                    {medicine.stock} {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">Rp {medicine.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{new Date(medicine.expiryDate).toLocaleDateString()}</span>
                    {(() => {
                      const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      if (daysUntilExpiry < 0) {
                        return <Badge variant="destructive" className="w-fit text-[10px] px-1 py-0 h-5">Expired</Badge>;
                      } else if (daysUntilExpiry < 90) {
                         return <Badge variant="warning" className="w-fit text-[10px] px-1 py-0 h-5">Expiring in {daysUntilExpiry} days</Badge>;
                      }
                      return null;
                    })()}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{medicine.supplier}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onQuickAdd(medicine)}
                      className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(medicine)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(medicine.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
