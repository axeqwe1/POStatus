export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  size: string; // เช่น 'S', 'M', 'L', 'XL'
  color: string; // เช่น 'แดง', 'ดำ', 'ขาว'
  unit: number; // จำนวนคงเหลือในสต็อก
  sku?: string; // รหัสสินค้า (optional)
  imageUrl?: string; // URL รูปภาพ (optional)
}

export interface PO_Status {
  PONo: string;
  Supreceive: boolean;
  downloadDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string; // ชื่อผู้ติดต่อ
  contactEmail: string; // อีเมลผู้ติดต่อ
  contactPhone: string; // เบอร์โทรผู้ติดต่อ
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string; // เช่น 'admin', 'user', 'supplier'
  roleId: number;
  supplierCode?: string; // optional, ถ้าเป็นผู้ใช้ที่เป็น supplier
}
