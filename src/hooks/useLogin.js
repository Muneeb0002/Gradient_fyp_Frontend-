import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../auth.api.js/login.api.js";
import { default as AsyncStorage } from '@react-native-async-storage/async-storage';


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
        console.log(data.token)
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }
      console.log("Login Successful");
    },
    onError: (error) => {
      console.error("Login Error:", error.response?.data?.message || error.message);
    },
  });
};