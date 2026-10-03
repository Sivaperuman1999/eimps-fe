export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export interface UserResponse {
  message?: string;
  data?: User | User[];
}

export interface UsersResponse {
  message?: string;
  data: User[];
}
