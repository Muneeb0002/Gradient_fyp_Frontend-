import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.73.252.130:4000/api"
      : "http://localhost:4000/api",
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
