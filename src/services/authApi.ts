import api from "./axios";

/* LOGIN */
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  return res.data;
};


/* REGISTER */
// export const registerUser = async (
//   username: string,
//   email: string,
//   password: string,
//   termsAccepted: boolean
// ) => {
//   const res = await api.post<any>("/api/v1/auth/register", {
//     username,
//     email,
//     password,
//     termsAccepted
//   });

//   return res.data;
// };

/* VERIFY EMAIL */
// export const verifyEmail = async (email: string, otp: string) => {
//   const res = await api.post<any>("/api/v1/auth/verify-email", {
//     email,
//     otp,
//   });

//   return res.data;
// };

// export const forgotPasswordApi = async (email: string) => {
//   const res = await api.post("/api/v1/auth/forgot-password", { email });
//   return res.data;
// };

// export const verifyResetOtpApi = async (email: string, otp: string) => {
//   const res = await api.post("/api/v1/auth/verify-reset-otp", { email, otp });
//   return res.data;
// };

// export const resetPasswordApi = async (
//   email: string,
//   newPassword: string,
//   confirmPassword: string
// ) => {
//   const res = await api.post("/api/v1/auth/reset-password", {
//     email,
//     newPassword,
//     confirmPassword,
//   });
//   return res.data;
// };


// // google login
// export const googleLoginApi = async (
//   idToken: string,
//   termsAccepted: boolean
// ) => {
//   const res = await api.post("/api/v1/auth/social/google", {
//     idToken,
//     termsAccepted
//   });

//   return res.data;
// };


/* LOGOUT */
export const logoutApi = async (refreshToken: string) => {
  const res = await api.post("/api/v1/user/logout", {
    refreshToken,
  });

  return res.data;
};


