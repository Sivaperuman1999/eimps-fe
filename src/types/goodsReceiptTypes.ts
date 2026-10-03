export interface GoodsReceiptItem {
  id: string;
  goodsReceiptId: string;
  itemId: string;
  receivedQuantity: number;

  item?: {
    id: string;
    name: string;
    sku: string;
    description?: string;
  };
}

export interface GoodsReceiptPurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  status: string;
  orderDate: string;
  totalAmount: string;

  vendor?: {
    id: string;
    name: string;
    code?: string;
  };
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  receivedDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  purchaseOrder?: GoodsReceiptPurchaseOrder;

  items: GoodsReceiptItem[];
}

export type GoodsReceiptListResponse = GoodsReceipt[];

export interface CreateGoodsReceiptRequest {
  purchaseOrderId: string;
  receiptDate: string;

  items: {
    itemId: string;
    quantity: number;
  }[];
}

export interface UpdateGoodsReceiptRequest {
  purchaseOrderId?: string;
  receiptDate?: string;

  items?: {
    itemId: string;
    quantity: number;
  }[];
}

export interface GoodsReceiptFormItem {
  itemId: string;
  quantity: number;
}

export interface GoodsReceiptFormData {
  purchaseOrderId: string;
  receiptDate: string;
  items: GoodsReceiptFormItem[];
}
