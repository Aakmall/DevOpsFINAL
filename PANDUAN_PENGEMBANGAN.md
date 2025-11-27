# 📋 Panduan Pengembangan ApoSmart

## ✅ Yang Sudah Dibuat (Tanpa Database)

Sistem ApoSmart v1 sudah lengkap dengan fitur-fitur berikut:

### 1. **Dashboard**
- ✅ Statistik real-time (Total Obat, Stok Rendah, Kategori, Penjualan)
- ✅ Grafik Bar untuk overview stok bulanan
- ✅ Grafik Line untuk penjualan mingguan
- ✅ Alert obat stok rendah (highlighted merah)
- ✅ Alert obat hampir kadaluarsa

### 2. **Manajemen Obat**
- ✅ CRUD lengkap (Create, Read, Update, Delete)
- ✅ Modal popup untuk tambah/edit obat
- ✅ Quick Add Stock (tombol + untuk tambah stok cepat)
- ✅ Search & filter real-time
- ✅ Status stok dengan warna (merah = habis/rendah, kuning = low stock, hijau = normal)
- ✅ Form lengkap: nama, kategori, supplier, stok, harga, tanggal kadaluarsa

### 3. **Manajemen Kategori**
- ✅ CRUD kategori obat
- ✅ Color picker untuk setiap kategori
- ✅ Counter jumlah obat per kategori
- ✅ Search kategori

### 4. **Manajemen Supplier**
- ✅ CRUD supplier
- ✅ Info lengkap: nama, kontak, email, alamat
- ✅ Counter jumlah obat per supplier
- ✅ Search supplier

### 5. **Laporan & Analytics**
- ✅ Grafik penjualan vs pembelian bulanan
- ✅ Pie chart kategori obat
- ✅ Top 5 obat terlaris
- ✅ Statistik profit dan transaksi
- ✅ Button export PDF/Excel (UI only, backend needed)

### 6. **Notifikasi**
- ✅ List notifikasi (stok rendah, obat kadaluarsa, update stok)
- ✅ Badge unread count
- ✅ Mark as read / Delete notifikasi
- ✅ Filter notifikasi yang belum dibaca

### 7. **UI/UX Features**
- ✅ Design system lengkap dengan tema medical (teal blue, green, amber)
- ✅ Smooth animations & transitions
- ✅ Responsive design
- ✅ Hover effects
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Beautiful logo

---

## 🔄 Apa yang Menggunakan State Lokal (Sementara)

Saat ini, **SEMUA DATA** disimpan di state React (useState). Artinya:

❌ Data hilang saat refresh halaman
❌ Data tidak tersimpan permanen
❌ Tidak ada authentication
❌ Tidak ada multi-user support

**File-file yang menggunakan state lokal:**
- `src/pages/Medicines.tsx` - Data obat
- `src/pages/Categories.tsx` - Data kategori
- `src/pages/Suppliers.tsx` - Data supplier
- `src/pages/Dashboard.tsx` - Data statistik & grafik (mock data)
- `src/pages/Reports.tsx` - Data laporan (mock data)
- `src/pages/Notifications.tsx` - Data notifikasi

---

## 🚀 Yang Perlu Anda Ubah Kedepannya

### **LANGKAH 1: Aktifkan Lovable Cloud (Backend)**

1. Klik tombol **"Connect Lovable Cloud"** di chat
2. Lovable akan otomatis membuat database PostgreSQL untuk Anda
3. Tidak perlu setup Supabase manual!

---

### **LANGKAH 2: Buat Database Tables**

Setelah Lovable Cloud aktif, buat tabel-tabel ini:

#### **Tabel `medicines`**
```sql
create table medicines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category_id uuid references categories(id),
  supplier_id uuid references suppliers(id),
  stock integer not null default 0,
  price numeric not null,
  expiry_date date not null,
  image_url text,
  created_at timestamp with time zone default now()
);
```

#### **Tabel `categories`**
```sql
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  color text not null default '#3B82F6',
  created_at timestamp with time zone default now()
);
```

#### **Tabel `suppliers`**
```sql
create table suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact text not null,
  email text not null,
  address text,
  created_at timestamp with time zone default now()
);
```

#### **Tabel `transactions`** (Opsional untuk tracking)
```sql
create table transactions (
  id uuid default gen_random_uuid() primary key,
  medicine_id uuid references medicines(id),
  type text check (type in ('purchase', 'sale')),
  quantity integer not null,
  total_price numeric not null,
  created_at timestamp with time zone default now()
);
```

#### **Tabel `notifications`**
```sql
create table notifications (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('low_stock', 'expiring', 'expired', 'success')),
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);
```

---

### **LANGKAH 3: Install Supabase Client**

Lovable Cloud menggunakan Supabase, jadi install package ini:

```bash
npm install @supabase/supabase-js
```

---

### **LANGKAH 4: Ubah Code dari State ke Database**

#### **A. Setup Supabase Client**

Buat file `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### **B. Contoh: Ubah Medicines.tsx**

**SEBELUM (State Lokal):**
```typescript
const [medicines, setMedicines] = useState(mockMedicines);

const handleDelete = (id: string) => {
  setMedicines(medicines.filter(m => m.id !== id));
};
```

**SESUDAH (Database):**
```typescript
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch medicines
const { data: medicines } = useQuery({
  queryKey: ['medicines'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, categories(*), suppliers(*)');
    if (error) throw error;
    return data;
  }
});

// Delete medicine
const queryClient = useQueryClient();
const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['medicines']);
    toast({ title: 'Medicine deleted' });
  }
});

const handleDelete = (id: string) => {
  deleteMutation.mutate(id);
};
```

#### **C. Contoh: Tambah Medicine dengan Form**

```typescript
const addMutation = useMutation({
  mutationFn: async (newMedicine: any) => {
    const { data, error } = await supabase
      .from('medicines')
      .insert([newMedicine])
      .select();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['medicines']);
    toast({ title: 'Medicine added!' });
  }
});

const handleSave = (medicineData: any) => {
  if (medicineData.id) {
    // Update
    updateMutation.mutate(medicineData);
  } else {
    // Create
    addMutation.mutate(medicineData);
  }
};
```

---

### **LANGKAH 5: Implementasi Fitur Upload Gambar**

Untuk upload gambar obat, gunakan Supabase Storage:

```typescript
// Upload image
const handleImageUpload = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('medicine-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('medicine-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

---

### **LANGKAH 6: Tambahkan Authentication (Opsional)**

Jika ingin login/logout untuk staff:

```typescript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'staff@apotek.com',
  password: 'password123'
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'staff@apotek.com',
  password: 'password123'
});

// Logout
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

### **LANGKAH 7: Implementasi Notifikasi Real-time**

Untuk notifikasi stok rendah otomatis:

1. **Buat trigger di database:**
```sql
create or replace function check_low_stock()
returns trigger as $$
begin
  if NEW.stock < 10 and OLD.stock >= 10 then
    insert into notifications (type, title, message)
    values ('low_stock', 'Low Stock Alert', 
            NEW.name || ' stock is running low (' || NEW.stock || ' units remaining)');
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger medicine_stock_trigger
after update on medicines
for each row
execute function check_low_stock();
```

2. **Subscribe ke real-time updates:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        toast({ title: payload.new.title, description: payload.new.message });
        queryClient.invalidateQueries(['notifications']);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

### **LANGKAH 8: Export PDF & Excel**

Install libraries untuk export:

```bash
npm install jspdf jspdf-autotable xlsx
```

**Export PDF:**
```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.text('Medicine Report', 14, 15);
  
  autoTable(doc, {
    head: [['Name', 'Category', 'Stock', 'Price']],
    body: medicines.map(m => [m.name, m.category, m.stock, m.price])
  });
  
  doc.save('medicines-report.pdf');
};
```

**Export Excel:**
```typescript
import * as XLSX from 'xlsx';

const handleExportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(medicines);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Medicines');
  XLSX.writeFile(workbook, 'medicines-report.xlsx');
};
```

---

## 📝 Checklist Pengembangan

Gunakan checklist ini untuk tracking progress Anda:

### Database Setup
- [ ] Aktifkan Lovable Cloud
- [ ] Buat tabel `medicines`
- [ ] Buat tabel `categories`
- [ ] Buat tabel `suppliers`
- [ ] Buat tabel `transactions` (opsional)
- [ ] Buat tabel `notifications`
- [ ] Setup RLS (Row Level Security) policies

### Code Migration
- [ ] Install `@supabase/supabase-js`
- [ ] Buat `src/lib/supabase.ts`
- [ ] Ubah Medicines.tsx ke database
- [ ] Ubah Categories.tsx ke database
- [ ] Ubah Suppliers.tsx ke database
- [ ] Ubah Dashboard.tsx ke database
- [ ] Ubah Notifications.tsx ke database

### Advanced Features
- [ ] Implementasi upload gambar obat
- [ ] Implementasi authentication
- [ ] Implementasi real-time notifications
- [ ] Implementasi export PDF
- [ ] Implementasi export Excel
- [ ] Implementasi barcode scanning (optional)
- [ ] Implementasi laporan penjualan
- [ ] Implementasi pencatatan transaksi

### Testing & Deployment
- [ ] Test semua fitur CRUD
- [ ] Test real-time updates
- [ ] Test di mobile/tablet
- [ ] Deploy ke production

---

## 💡 Tips Pengembangan

1. **Mulai dari satu halaman dulu** - Ubah Medicines.tsx dulu, baru yang lain
2. **Gunakan React Query** - Sudah include di project, bagus untuk caching
3. **Test increment** - Test setiap perubahan, jangan sekaligus
4. **Backup data** - Export data sebelum migration
5. **Read Lovable Docs** - https://docs.lovable.dev/features/cloud

---

## 🆘 Troubleshooting

**Q: Data hilang saat refresh?**
A: Normal! Karena masih pakai state lokal. Aktifkan Lovable Cloud untuk persistent storage.

**Q: Bagaimana cara connect ke database?**
A: Klik "Connect Lovable Cloud" di chat, atau ketik "enable lovable cloud" ke AI assistant.

**Q: Apakah harus bayar untuk Lovable Cloud?**
A: Ada free tier dengan usage limit. Cek pricing di lovable.dev/pricing

**Q: Bisa pakai database selain Supabase?**
A: Lovable Cloud based on Supabase, tapi Anda bisa custom setup jika mau.

---

## 📚 Resources

- Lovable Docs: https://docs.lovable.dev/
- Supabase Docs: https://supabase.com/docs
- React Query: https://tanstack.com/query/latest

---

**Dibuat dengan ❤️ menggunakan Lovable AI**

Semua fitur UI sudah siap pakai. Anda tinggal connect ke database saja! 🚀
