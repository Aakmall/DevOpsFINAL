import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (quantity: number) => void;
  medicineName: string;
}

export const QuickAddModal = ({ open, onClose, onAdd, medicineName }: QuickAddModalProps) => {
  const [quantity, setQuantity] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(quantity);
    setQuantity(10);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick Add Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Medicine</Label>
            <p className="font-semibold text-lg mt-1">{medicineName}</p>
          </div>

          <div>
            <Label htmlFor="quantity">Add Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="mt-1 text-lg"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-success hover:bg-success/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
