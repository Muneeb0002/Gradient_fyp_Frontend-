import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAdminAccount,
    fetchAdminHistoryList,
    fetchAdminUsersList,
    fetchAdmins,
    fetchUsers
} from "../admin.api/fetchAdminUsersList.js"; // Apni file ka sahi path de dena


export const useFetchAdminUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => fetchAdminUsersList(credentials),
    onSuccess: (responseData) => {
      console.log("Students data fetched successfully:", responseData.total);
      
      // Agar aap chahein to is data ko cache mein set kar sakte hain taake doosri screens use kar sakein
      queryClient.setQueryData(["adminStudentsList"], responseData.data);
    },
    onError: (error) => {
      console.error("Students list fetch karne mein error aya:", error.message);
    },
  });
};


export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: createAdminAccount,

    onSuccess: (data) => {
      console.log("🎉 ADMIN CREATED SUCCESSFULLY");
      console.log("📦 Response:", data);
    },

    onError: (error) => {
      console.log("❌ ADMIN CREATE FAILED");

      console.log(
        error?.response?.data || error.message
      );
    },
  });
};


export const useFetchAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,

    onSuccess: (data) => {
      console.log("🎉 ADMINS FETCH SUCCESS");
      console.log("👥 TOTAL ADMINS:", data?.total);
      console.log("📋 ADMINS LIST:", data?.data);
    },

    onError: (error) => {
      console.log("❌ ADMINS FETCH ERROR:");
      console.log(error?.response?.data || error.message);
    },
  });
};






export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,

    onSuccess: (data) => {
      console.log("✅ USERS LOADED:", data.total);
    },

    onError: (error) => {
      console.log(
        "❌ USERS FETCH ERROR:",
        error.response?.data || error.message
      );
    },
  });
};



export const useFetchAdminHistory = () => {
  return useQuery({
    queryKey: ["adminHistoryList"], // Unique key cache handle karne ke liye
    queryFn: fetchAdminHistoryList,  // Aapka api function
    
    // TanStack Query v5+ mein onSuccess/onError direct hook mein nahi hota, 
    // isliye hum data transform ya fetch hote hi console yahan bhi laga sakte hain:
    select: (data) => {
      console.log("--- TanStack Query Cached Total History: ---", data.total);
      console.log("--- First History Item Check: ---", data.data?.[0]);
      return data;
    },
    
    // Refetch settings (optional)
    refetchOnWindowFocus: false, 
  });
};