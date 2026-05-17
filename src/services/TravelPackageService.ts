import api from "./axios";

export const TRAVEL_PACKAGE_STATUS = {

  PENDING: "PENDING",

  APPROVED: "APPROVED",

  REJECTED: "REJECTED"

} as const;

export type TravelPackageStatus =
  "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface TravelPackageListResponse {

  id: number;
  title: string;
  thumbnailUrl: string;
  durationDays: number;
  durationNights: number;
  startingLocation: string;
  endingLocation: string;
  startDate: string;
  endDate: string;
  actualPrice: number;
  earlyBirdPrice?: number;

}

export interface PagedResponse<T> {

  content: T[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;

  last: boolean;
}

export interface TravelPackageFilterParams {
  title?: string;
  startingLocation?: string;
  categoryId?: number;
  startDate?: string;
  maxActualPrice?: number;
  status?: TravelPackageStatus;
  page?: number;
  size?: number;
}

/* ================= ADMIN LIST ================= */

export const getTravelPackages =
  async (
    params: TravelPackageFilterParams
  ): Promise<
    PagedResponse<
      TravelPackageListResponse
    >
  > => {

    const response = await api.get(
      "/api/v1/admin/travel-packages",
      {
        params
      }
    );

    return response.data.data;
  };




export interface TravelPackageDetailResponse {

  id: number;

  title: string;

  overview: string;

  durationDays: number;

  durationNights: number;

  startingLocation: string;

  endingLocation: string;

  startDate: string;

  endDate: string;

  actualPrice: number;

  earlyBirdPrice?: number;

  earlyBirdLastDate?: string;

  briefItinerary: string;

  inclusions: string;

  exclusions: string;

  thingsToCarry: string;

  cancellationPolicy: string;

  brochurePdfUrl?: string;

  status: "PENDING" | "APPROVED" | "REJECTED";

  adminRemark?: string;

  imageUrls: string[];

  createdBy: number;

  reviewedBy?: number;

  reviewedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ================= DETAIL ================= */

export const fetchTravelPackageDetail =
  async (
    id: number
  ): Promise<TravelPackageDetailResponse> => {

    const response = await api.get(
      `/api/v1/travel-packages/${id}`
    );

    return response.data.data;
  };

/* ================= APPROVE ================= */

export const approveTravelPackage =
  async (id: number): Promise<void> => {

    await api.patch(
      `/api/v1/admin/travel-packages/${id}/approve`
    );
  };

/* ================= REJECT ================= */

export const rejectTravelPackage =
  async (
    id: number,
    remark: string
  ): Promise<void> => {

    await api.patch(
      `/api/v1/admin/travel-packages/${id}/reject`,
      {
        remark
      }
    );
  };