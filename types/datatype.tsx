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

export interface PoData {
  poNo: string;
  companyCode: string;
  suppCode: string;
  suppContact: string;
  closePO: boolean;
}

export interface PO_Status {
  PONo: string;
  Supreceive: boolean;
  cancelStatus?: number;
  confirmDate: string;
  sendDate: Date;
  PODetails: PO_Details[];
  finalETADate?: Date;
  supplierName?: string;
}

export interface PO_Details {
  poNo: string;
  matrClass: string;
  matrCode: string;
  description: string;
  color?: string;
  size?: string;
  finalETADate?: Date;
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
  password: string;
  role: string; // เช่น 'admin', 'user', 'supplier'
  roleId: number;
  supplierCode?: string; // optional, ถ้าเป็นผู้ใช้ที่เป็น supplier
  supplierName?: string;
}
