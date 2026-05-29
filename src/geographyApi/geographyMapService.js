import api from "../api/axios.api.js";

export const fetchMapData = async (query) => {
    // /map?query=rivers
    const response = await api.get(`/map`, {
        params: { query } 
    });
    return response.data;
};