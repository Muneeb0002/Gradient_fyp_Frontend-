import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
<<<<<<< HEAD
      ? "http://172.16.4.49:4000/api"
      : "http://localhost:4000/api",
=======
      ? "http://10.157.141.62:7000/api"
      : "http://localhost:7000/api",
>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
});


api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(
      "Interceptors: Storage not ready, sending request without token",
    );
  }
  return config;
});

export default api;
