import api from "../api/axios.api.js";

export const verifyOtp = async (otpData) => {
  // otpData will be { email, otp }
  const response = await api.post("/users/verify-otp", otpData);
  return response.data;
};



