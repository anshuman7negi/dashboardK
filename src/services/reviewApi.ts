import api from "./axios";

/* ================= TYPES ================= */

export interface ReviewResponse {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages?: number;
}

/* ================= FETCH REVIEWS ================= */

export const fetchReviews = async (
  destinationId: number,
  page = 0,
  size = 4
): Promise<PagedResponse<ReviewResponse>> => {

  const res = await api.get<PagedResponse<ReviewResponse>>(
    `/api/v1/destinations/${destinationId}/reviews`,
    {
      params: { page, size }
    }
  );

  return res.data;
};


/* ================= CREATE REVIEW ================= */

export const createReview = async (
  destinationId: number,
  data: ReviewRequest
): Promise<void> => {

  await api.post(
    `/api/v1/destinations/${destinationId}/reviews`,
    data
  );

};


/* ================= DELETE REVIEW BY ADMIN ================= */

export const deleteReviewByAdmin = async (
  reviewId: number
): Promise<void> => {

  await api.delete(
    `/api/v1/admin/reviews/${reviewId}`
  );

};


/* ================= UPDATE REVIEW ================= */

export const updateReview = async (
  destinationId: number,
  reviewId: number,
  data: ReviewRequest
): Promise<void> => {

  await api.put(
    `/api/v1/destinations/${destinationId}/reviews/${reviewId}`,
    data
  );

};