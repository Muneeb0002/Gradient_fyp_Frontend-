import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../auth.api.js/login.api.js";
import { default as AsyncStorage } from '@react-native-async-storage/async-storage';
import { AUTH_KEYS } from '../../lib/authSession';


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      if (data?.role) {
        await AsyncStorage.setItem(AUTH_KEYS.ROLE, data.role);
      }
      if (data?.token) {
        await AsyncStorage.setItem(AUTH_KEYS.TOKEN, data.token);
      }
    },
    onError: () => {
      /* Handled in screen — avoid Expo red error overlay */
    },
  });
};