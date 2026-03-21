import api from "./axios";

export interface AdminEventResponse {
  id: number;
  title: string;
  desc?: string;
  starteventdate: string;
  endeventdate: string;
}

export interface AdminEventFilterParams {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
}

export const fetchAdminEvents = async (
  params: AdminEventFilterParams
): Promise<PagedResponse<AdminEventResponse>> => {

  const res = await api.get<PagedResponse<AdminEventResponse>>(
    "/api/v1/events",
    { params }
  );

  return res.data;
};

export const approveEvent = async (id: number) => {
  await api.patch(`/api/v1/admin/events/${id}/approve`);
};

export const rejectEvent = async (id: number, remark: string) => {
  await api.patch(`/api/v1/admin/events/${id}/reject`, { remark });
};


// services/adminEventApi.ts

export interface EventDetailResponse {
  id: number;
  title: string;
  desc?: string;
  longdesc?: string;
  yturl?: string;
  starteventdate: string;
  endeventdate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  image?: string;
  adminRemark?: string;
}

export const fetchEventDetail = async (id: number) => {
  const res = await api.get<EventDetailResponse>(`/api/v1/events/${id}`);
  return res.data;
};