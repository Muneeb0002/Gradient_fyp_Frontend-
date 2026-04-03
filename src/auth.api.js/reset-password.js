import api from "../api/axios.api.js";

export const resetPasswordUser = async (resetData) => {
    const response = await api.post(`/users/reset-password`, resetData);
    return response.data;
};