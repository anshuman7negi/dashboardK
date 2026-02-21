import api from "./axios";

/* ================= TYPES ================= */

export interface RoleDto {
  id: number;
  name: string;
}

export interface RoleRequest {
  name: string;
}

export interface PermissionDto {
  id: number;
  name: string;
}

export interface PermissionRequest {
  name: string;
}

/* ================= ROLE APIs ================= */

/* CREATE ROLE */
export const createRole = async (data: RoleRequest) => {
  const res = await api.post("/api/v1/admin/roles", data);
  return res.data;
};

/* GET ALL ROLES */
export const getAllRoles = async (): Promise<RoleDto[]> => {
  const res = await api.get("/api/v1/admin/roles");

  return res.data?.data || [];
};

/* Delete ROLE */

export const deleteRole = async (id: number) => {
  const res = await api.delete(`/api/v1/admin/roles/${id}`);
  return res.data;
};


/* ================= PERMISSION APIs ================= */

/* CREATE PERMISSION */
export const createPermission = async (data: PermissionRequest) => {
  const res = await api.post("/api/v1/admin/permissions", data);
  return res.data;
};

/* GET ALL PERMISSIONS */
export const getAllPermissions = async (): Promise<PermissionDto[]> => {
  const res = await api.get("/api/v1/admin/permissions");
  return res.data?.data || [];
};

/* DELETE PERMISSION */
export const deletePermission = async (id: number) => {
  const res = await api.delete(`/api/v1/admin/permissions/${id}`);
  return res.data;
};


/* ASSIGN PERMISSION TO ROLE */
export const assignPermissionToRole = async (
  roleId: number,
  permissionId: number
) => {
  const res = await api.post(
    `/api/v1/admin/roles/${roleId}/permissions/${permissionId}`
  );
  return res.data;
};


/* GET ROLE PERMISSIONS */
export const getRolePermissions = async (
  roleId: number
): Promise<PermissionDto[]> => {
  const res = await api.get(
    `/api/v1/admin/roles/${roleId}/permissions`
  );
  return res.data?.data || [];
};


export const updateRolePermissions = async (
  roleId: number,
  permissionIds: number[]
) => {
  const response = await api.put(
    `/api/v1/admin/roles/${roleId}/permissions`,
    permissionIds
  );
  return response.data.data;
};
