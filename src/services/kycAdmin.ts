import api from "./axios";

export type KycStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface KycListResponse {

  kycId: number;

  fullName: string;

  aadhaarDocumentUrl: string;

  status: KycStatus;
}

/* ================= GET ALL KYCS ================= */

export const getAllKycs = async ():
  Promise<KycListResponse[]> => {

  const response = await api.get(
    "/kyc/list"
  );

  return response.data.data;
};

export interface KycDocumentResponse {

  documentType:
    | "PAN"
    | "AADHAAR"
    | "BANK"
    | "GST";

  fileUrl: string;
}

export interface KycDetailResponse {

  kycId: number;

  fullName: string;

  mobileNumber: string;

  email: string;

  businessName: string;

  gstNumber?: string;

  panNumber: string;

  aadhaarNumber: string;

  bankAccountNumber: string;

  ifscCode: string;

  status: KycStatus;

  rejectionReason?: string;

  submittedAt: string;

  verifiedAt?: string;

  documents: KycDocumentResponse[];
}

/* ================= DETAIL ================= */

export const getKycDetail = async (
  kycId: number
): Promise<KycDetailResponse> => {

  const response = await api.get(
    `/kyc/${kycId}`
  );

  return response.data.data;
};

/* ================= VERIFY ================= */

export interface VerifyKycRequest {

  kycId: number;

  status: KycStatus;

  rejectionReason?: string;
}

export const verifyKyc = async (
  data: VerifyKycRequest
): Promise<void> => {

  await api.post(
    "/kyc/verify",
    data
  );
};