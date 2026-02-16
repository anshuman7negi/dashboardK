import api from "./axios";

export interface StateDto {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export interface StateRequest {
  name: string;
  description: string;
  countryId: number;
  image: File;
}

/* CREATE STATE */
export const createState = async (data: StateRequest) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("countryId", String(data.countryId));
  formData.append("image", data.image);

  const res = await api.post("/api/v1/states", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* GET STATES BY COUNTRY */
export const getStatesByCountry = async (
  countryId: number
): Promise<StateDto[]> => {
  const res = await api.get(
    `/api/v1/states/${countryId}/states`
  );

  return res.data?.data || [];
};
