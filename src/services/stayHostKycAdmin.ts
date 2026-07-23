import api from "./axios";

export type KycStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface StayHostKycListResponse {
  id: number;
  fullName: string;
  profileImage: string;
  status: KycStatus;
}

export interface StayHostKycPageResponse {
  content: StayHostKycListResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getStayHostKycs = async (
  status: KycStatus,
  page = 0,
  size = 9,
  name = ""
): Promise<StayHostKycPageResponse> => {

  const res = await api.get("/stay-host-kyc/admin/list", {
    params: {
      status,
      page,
      size,
      name
    }
  });

  return res.data.data;
};


export interface StayHostKycDocumentResponse {
  documentType: "PAN" | "AADHAAR" | "BANK" | "GST";
  fileUrl: string;
}

export interface StayHostKycDetailResponse {
  id: number;

  fullName: string;

  panNumber: string;

  aadhaarNumber: string;

  bankAccountHolder: string;

  bankAccountNumber: string;

  ifscCode: string;

  bankName: string;

  panImage: string;

  aadhaarFrontImage: string;

  aadhaarBackImage: string;

  selfieImage: string;

  status: KycStatus;

  rejectionReason?: string;

  verifiedAt?: string;

  createdAt: string;
}

export const getStayHostKycDetail = async (
  id: number
): Promise<StayHostKycDetailResponse> => {

  const res = await api.get(
    `/stay-host-kyc/admin/${id}`
  );

  return res.data.data;
};

export interface StayHostVerifyRequest {

  kycId: number;

  status: KycStatus;

  rejectionReason?: string;
}


export const verifyStayHostKyc = async (
  request: StayHostVerifyRequest
) => {

  await api.post(
    "/stay-host-kyc/admin/verify",
    request
  );

};