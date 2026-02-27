import type { ApiResponse } from "../types/ApiResponse";
import api from "./axios";

/* ================= TYPES ================= */

export interface AdminDraftResponse {
  id: number;
  name: string;
  shortDescription: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  coverImage: string | null;
}

/* ================= FETCH ADMIN DRAFTS ================= */

export const fetchAdminDrafts = async (): Promise<AdminDraftResponse[]> => {
  const res = await api.get<ApiResponse<AdminDraftResponse[]>>(
    "/api/v1/destination-drafts/admin/all"
  );

  return res.data.data;
};

/* ================= APPROVE ================= */

export const approveDestinationDraft = async (
  id: number
): Promise<void> => {
  await api.post(
    `/api/v1/destination-drafts/admin/${id}/approve`
  );
};

/* ================= REJECT ================= */

export const rejectDestinationDraft = async (
  id: number,
  remark?: string
): Promise<void> => {
  await api.post(
    `/api/v1/destination-drafts/admin/${id}/reject`,
    null,
    {
      params: { remark }
    }
  );
};