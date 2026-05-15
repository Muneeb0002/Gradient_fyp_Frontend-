import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyOtp } from "../auth.api.js/verifyOtp.api.js";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async (data) => {
      console.log("Verification Successful:", data.message);
      
      // Save token to storage so the interceptor can use it
      if (data.token) {
        try {
          await AsyncStorage.setItem("token", data.token);
          // Optional: user details bhi save kar sakte hain
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          console.error("Error saving token:", error);
        }
      }
    },
    onError: (error) => {
      console.error(
        "OTP Verification Error:", 
        error.response?.data?.message || error.message
      );
    },
  });
};