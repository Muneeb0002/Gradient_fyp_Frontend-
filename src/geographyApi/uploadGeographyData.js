import api from "../api/axios.api.js";


export const uploadGeographyData = async (formData) => {
    const response = await api.post("/geography/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
