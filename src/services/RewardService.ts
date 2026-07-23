import api from "./axios";

export interface RewardDto {
  id: number;
  title: string;
  points: number;
  description: string;
  badgeIcon: string;
}

export interface RewardRequest {
  title: string;
  points: number;
  description: string;
}

export const getRewards = async () => {
  const res = await api.get("/api/v1/admin/rewards");

    return res.data.content;
};

export const createReward = async (
  request: RewardRequest,
  badgeIcon: File
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(request)], {
      type: "application/json",
    })
  );

  formData.append("badgeIcon", badgeIcon);

  const res = await api.post(
    "/api/v1/admin/rewards",
    formData
  );

  return res.data;
};

export const updateReward = async (
  id: number,
  request: RewardRequest,
  badgeIcon?: File
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(request)], {
      type: "application/json",
    })
  );

  if (badgeIcon) {
    formData.append("badgeIcon", badgeIcon);
  }

  const res = await api.put(
    `/api/v1/admin/rewards/${id}`,
    formData
  );

  return res.data;
};