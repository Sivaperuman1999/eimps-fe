import api from "../api/axios";

export interface Role {
  id?: string;
  _id?: string;
  code?: string;
  roleCode?: string;
  name?: string;
  roleName?: string;
}

export interface CategoryMetadata {
  id: number;
  name: string;
}

export interface Metadata {
  roles: Role[];
  categories: CategoryMetadata[];
}

export interface MetadataResponse {
  success: boolean;
  message: string;
  data: {
    data: Metadata;
  };
}

export interface RolesResponse {
  success: boolean;
  message?: string;
  data: Role[] | { data: Role[] };
}

const metadataService = {
  getMetadata: async (): Promise<MetadataResponse> => {
    const response = await api.get<MetadataResponse>(
      "/metadata",
    );
    return response.data;
  },
  getRoles: async (): Promise<RolesResponse> => {
    const response = await api.get<RolesResponse>("/metadata/roles");
    return response.data;
  }
};

export default metadataService;