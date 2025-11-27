import { useState, useEffect } from "react";
import { MedicineTable } from "@/components/medicines/MedicineTable";
import { MedicineModal } from "@/components/medicines/MedicineModal";
import { QuickAddModal } from "@/components/medicines/QuickAddModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Medicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [quickAddModal, setQuickAddModal] = useState<{ open: boolean; medicine: any | null }>({
    open: false,
    medicine: null,
  });
  const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medicinesRes, categoriesRes, suppliersRes] = await Promise.all([
        supabase.from('medicines').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('suppliers').select('*')
      ]);

      if (medicinesRes.error) throw medicinesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (suppliersRes.error) throw suppliersRes.error;

      setMedicines(medicinesRes.data || []);
      setCategories(categoriesRes.data || []);
      setSuppliers(suppliersRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from Supabase. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (medicineData: any) => {
    try {
      if (medicineData.id) {
        // Update existing
        const { error } = await supabase
          .from('medicines')
          .update(medicineData)
          .eq('id', medicineData.id);
        
        if (error) throw error;
        
        setMedicines(medicines.map((m) => (m.id === medicineData.id ? { ...m, ...medicineData } : m)));
        toast({ title: "Medicine Updated", description: `${medicineData.name} has been updated.` });
      } else {
        // Add new
        // Remove ID if it's empty or let Supabase handle it if it's UUID
        const { id, ...newMedicineData } = medicineData;
        const { data, error } = await supabase
          .from('medicines')
          .insert([newMedicineData])
          .select()
          .single();
          
        if (error) throw error;
        
        setMedicines([...medicines, data]);
        toast({ title: "Medicine Added", description: `${medicineData.name} has been added.` });
      }
    } catch (error: any) {
      console.error('Error saving medicine:', error);
      toast({
        title: "Error",
        description: `Failed to save medicine: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (medicine: any) => {
    setEditingMedicine(medicine);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const medicine = medicines.find((m) => m.id === id);
      setMedicines(medicines.filter((m) => m.id !== id));
      toast({
        title: "Medicine Deleted",
        description: `${medicine?.name} has been removed from the system.`,
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Error deleting medicine:', error);
      toast({
        title: "Error",
        description: `Failed to delete medicine: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleQuickAdd = (medicine: any) => {
    setQuickAddModal({ open: true, medicine });
  };

  const handleQuickAddSubmit = async (quantity: number) => {
    if (quickAddModal.medicine) {
      try {
        const newStock = quickAddModal.medicine.stock + quantity;
        const { error } = await supabase
          .from('medicines')
          .update({ stock: newStock })
          .eq('id', quickAddModal.medicine.id);

        if (error) throw error;

        setMedicines(
          medicines.map((m) =>
            m.id === quickAddModal.medicine.id ? { ...m, stock: newStock } : m
          )
        );
        toast({
          title: "Stock Added",
          description: `Added ${quantity} units to ${quickAddModal.medicine.name}`,
        });
      } catch (error: any) {
        console.error('Error updating stock:', error);
        toast({
          title: "Error",
          description: `Failed to update stock: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleAdd = () => {
    setEditingMedicine(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground mt-2">Manage your pharmacy inventory</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search medicines, categories, or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border/50 bg-card/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <MedicineTable
        medicines={filteredMedicines}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickAdd={handleQuickAdd}
      />

      <MedicineModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleSave}
        medicine={editingMedicine}
        categories={categories}
        suppliers={suppliers}
      />

      <QuickAddModal
        open={quickAddModal.open}
        onClose={() => setQuickAddModal({ open: false, medicine: null })}
        onAdd={handleQuickAddSubmit}
        medicineName={quickAddModal.medicine?.name || ""}
      />
    </div>
  );
}
