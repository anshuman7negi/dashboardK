import api from "./axios";

export interface AdminUserDto {
  id: number;
  fullname: string;
  username: string;
  email: string;
  roles: string[];
  status: string;
}

export interface UserPageResponse {
  content: AdminUserDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/* GET USERS */

export const getAdminUsers = async (
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<UserPageResponse> => {
  const params: Record<string, string | number> = {
    page,
    size,
  };

  if (search && search.trim()) {
    params.search = search.trim();
  }

  const res = await api.get("/api/v1/admin/users", {
    params,
  });

  return res.data?.data;
};

export interface AdminUserDto {
  id: number;
  fullname: string;
  username: string;
  email: string;
  roles: string[];
  status: string;
}

/* GET SINGLE USER */

export const getAdminUser = async (
  userId: number
): Promise<AdminUserDto> => {
  const res = await api.get(`/api/v1/admin/users/${userId}`);

  return res.data?.data;
};

/* ASSIGN USER ROLES */

export const assignUserRoles = async (
  userId: number,
  roles: string[]
) => {
  const res = await api.put(
    `/api/v1/admin/users/${userId}/roles`,
    {
      roles,
    }
  );

  return res.data;
};