export interface PurchaseOrderVendor {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface PurchaseOrderItemDetails {
  id: string;
  name: string;
  sku: string;
  description?: string;
  unitPrice: string;
  isActive: boolean;
  categoryId: number;
}

export interface PurchaseOrderItem {
  id?: string;
  purchaseOrderId?: string;
  itemId: string;
  quantity: number;
  unitPrice: string | number;
  totalPrice?: string | number;
  item?: PurchaseOrderItemDetails;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendor: PurchaseOrderVendor;
  status: string;
  orderDate: string;
  totalAmount: string | number;
  createdAt?: string;
  updatedAt?: string;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderRequest {
  vendorId: string;
  orderDate: string;
  items: {
    itemId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdatePurchaseOrderRequest {
  vendorId?: string;
  orderDate?: string;
  items?: {
    itemId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
