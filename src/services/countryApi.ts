import api from "./axios";

export interface CountryDto {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export interface CountryRequest {
  name: string;
  code: string;
}

/* CREATE COUNTRY */
export const createCountry = async (data: CountryRequest) => {
  const res = await api.post("/api/v1/countries", data);
  return res.data;
};

/* GET ALL COUNTRIES */
export const getAllCountries = async (): Promise<CountryDto[]> => {
  const res = await api.get("/api/v1/countries");
  return res.data?.data || [];
};
