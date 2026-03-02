
import api from "./axios";

export interface CategoryDto {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}

/* ================= CREATE CATEGORY ================= */

export const createCategory = async (data: CategoryRequest) => {
  const res = await api.post("/api/v1/categories", data);
  return res.data;
};

/* ================= GET ALL ================= */

export const getAllCategories = async (): Promise<CategoryDto[]> => {
  const res = await api.get("/api/v1/categories");
  return res.data?.data || [];
};

/* ================= DELETE ================= */

export const deleteCategory = async (id: number) => {
  const res = await api.delete(`/api/v1/categories/${id}`);
  return res.data;
};