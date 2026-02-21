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

export const fetchAdminDrafts = async (
  status: string
): Promise<AdminDraftResponse[]> => {

  const res = await api.get<ApiResponse<AdminDraftResponse[]>>(
    "/api/v1/destination-drafts/admin/all",
    {
      params: { status }
    }
  );

  return res.data.data; // 🔥 wrapper se data nikala
};

/* ================= APPROVE ================= */

export const approveDestinationDraft = async (
  id: number
): Promise<void> => {
  await api.put(
    `/api/v1/destination-drafts/admin/approve/${id}`
  );
};

/* ================= REJECT ================= */

export const rejectDestinationDraft = async (
  id: number,
  reason?: string
): Promise<void> => {
  await api.put(
    `/api/v1/destination-drafts/admin/reject/${id}`,
    { reason }
  );
};