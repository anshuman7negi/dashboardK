
import api from "./axios";

/* ================= TYPES ================= */

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;        // current page
  first: boolean;
  last: boolean;
}

export interface AdminDestinationResponse {
  id: number;
  name: string;
  shortDescription: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  coverImageUrl: string | null;
  stateName?: string;
}

/* ================= FETCH ADMIN DESTINATIONS ================= */

export interface AdminDestinationFilterParams {
  status?: string;
  keyword?: string;
  stateId?: number;
  countryId?: number;
  createdFrom?: string;
  createdTo?: string;
  createdBy?: string;
  page?: number;
  size?: number;
}

export const fetchAdminDestinations = async (
  params: AdminDestinationFilterParams
): Promise<PagedResponse<AdminDestinationResponse>> => {

  const res = await api.get<PagedResponse<AdminDestinationResponse>>(
    "/api/v1/admin/destinations",
    { params }
  );

  return res.data;
};

/* ================= APPROVE ================= */

export const approveDestination = async (
  id: number
): Promise<void> => {

  await api.patch(
    `/api/v1/admin/destinations/${id}/approve`
  );
};

/* ================= REJECT ================= */

export const rejectDestination = async (
  id: number,
  remark: string
): Promise<void> => {

  await api.patch(
    `/api/v1/admin/destinations/${id}/reject`,
    {
      remark  
    }
  );
};


export interface DestinationDetailResponse {
  id: number;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  shortDescription: string;
  fullDescription: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  youtubeVideoUrl?: string;
  images: string[];
  adminRemark: string;
  averageRating: number;
  reviewCount: number;
}

export const fetchDestinationDetail = async (
  id: number
): Promise<DestinationDetailResponse> => {

  const res = await api.get<DestinationDetailResponse>(
    `/api/v1/destinations/${id}`
  );

  return res.data;
};