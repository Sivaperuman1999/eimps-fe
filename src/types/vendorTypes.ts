export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
