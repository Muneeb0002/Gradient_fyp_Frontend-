import api from "../api/axios.api.js";

export const forgotPasswordUser = async (email) => {
    const response = await api.post(`/users/forgot-password`, {email});
    console.log(response.data); 
    return response.data;
};