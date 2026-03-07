import api from "./axios";


export interface DestinationListResponse {
  id: number;
  name: string;
  shortDescription: string;
  coverImageUrl: string;
  stateName: string;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH";
  rating?: number;
}


/* ================= CREATE ================= */

export interface CreateDestinationRequest {
  name: string;
  stateId: number;
  countryId: number;
  shortDescription?: string;
  fullDescription?: string;
  address?: string;
  pincode?: string;
  youtubeVideoUrl?: string;
  latitude: number;
  longitude: number;
  categoryIds?: number[];
}

export const createDestination = async (
  data: CreateDestinationRequest,
  images: File[]
): Promise<void> => {

  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    })
  );

  images.forEach((file) => {
    formData.append("images", file);
  });

  await api.post("/api/v1/destinations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};