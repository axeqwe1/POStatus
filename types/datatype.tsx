export interface User {
  id: string;
  name: string;
  email: string;
}

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
