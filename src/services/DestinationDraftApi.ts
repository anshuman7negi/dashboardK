import type { ApiResponse } from "../types/ApiResponse";
import api from "./axios";


export interface CreateDestinationDraftRequest {
  stateId: number;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  youtubeVideoUrl?: string;
}

export interface DestinationDraft {
  id: number;
  name: string;
  status: string;
}

export const createDestinationDraft = async (
  payload: CreateDestinationDraftRequest,
  images: File[]
): Promise<DestinationDraft> => {

  const formData = new FormData();

  formData.append("stateId", String(payload.stateId));
  formData.append("name", payload.name);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("fullDescription", payload.fullDescription ?? "");
  formData.append("address", payload.address ?? "");
  formData.append("pincode", payload.pincode ?? "");
  formData.append("youtubeVideoUrl", payload.youtubeVideoUrl ?? "");

  if (payload.latitude !== undefined)
    formData.append("latitude", String(payload.latitude));

  if (payload.longitude !== undefined)
    formData.append("longitude", String(payload.longitude));

  images.forEach((file) => {
    formData.append("images", file);
  });

  const res = await api.post<ApiResponse<DestinationDraft>>(
    "/api/v1/destination-drafts/create-draft",
    formData
  );

  return res.data.data;
};

