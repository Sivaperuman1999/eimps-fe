import api from "../api/axios";

export interface Role {
  id: string;
  code: string;
  name: string;
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

const metadataService = {
  getMetadata: async (): Promise<MetadataResponse> => {
    const response = await api.get<MetadataResponse>(
      "/metadata",
    );
    return response.data;
  },
  getRoles: async (): Promise<any> => {
    const response = await api.get("/metadata/roles");
    return response.data;
  }
};

export default metadataService;