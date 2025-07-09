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
  POReady?: boolean;
  ClosePO?: boolean; // true ถ้า PO ถูกปิดแล้ว
  confirmDate: string;
  cancelStatus?: number; // true ถ้า PO ถูกยกเลิก
  sendDate: Date;
  PODetails: PO_Details[];
  finalETADate?: Date;
  supplierName?: string;
  attachedFiles?: FileItem[]; // เพิ่ม field นี้
  Remark?: string;
  amountNoVat?: number;
  amountTotal?: number;
  totalVat?: number;
  totalChange?: number;
}

export interface PO_Details {
  poNo: string;
  matrClass: string;
  matrCode: string;
  description: string;
  color?: string;
  size?: string;
  finalETADate?: Date;
  totalAmount?: number;
  unit?: string;
  chargeAmt: number;
  chargeValue: number;
  price: number;
  qty: number;
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

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  remark?: string; // optional, สำหรับบันทึก remark ของไฟล์
  uploadType?: number; // 1 = PO, 2 = Supplier
}

export interface Notifications {
  noti_id: string; // รหัสการแจ้งเตือน
  title: string; // หัวข้อการแจ้งเตือน
  message: string; // ข้อความการแจ้งเตือน
  type: string;
  refId: string;
  refType: string; // ประเภทการอ้างอิง เช่น 'PO', 'Supplier', 'User'
  createAt: string; // วันที่และเวลาที่สร้างการแจ้งเตือน
  createBy: string; // ผู้สร้างการแจ้งเตือน (อาจจะเป็น userId หรือ username)
}

export interface NotificationReceivers {
  noti_recvId: string;
  noti_id: string;
  isRead: boolean; // true ถ้าอ่านแล้ว
  readAt?: Date; // วันที่อ่าน (optional)
  isArchived: boolean; // true ถ้าเก็บไว้ใน archive
  notification: Notifications;
}
