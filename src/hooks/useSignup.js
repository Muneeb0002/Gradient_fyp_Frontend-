import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../auth.api.js/signup.api.js";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      console.log("Signup Successful:", data);
    },
    onError: (error) => {
      console.error("Signup Error:", error.response?.data?.message || error.message);
    },
  });
};