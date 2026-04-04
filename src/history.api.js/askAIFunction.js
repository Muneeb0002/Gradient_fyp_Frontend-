import api from "../api/axios.api.js";


export const askAIFunction = async ({ query, marks }) => {
    const { data } = await api.post("/ai/ask-ai", {
        query: query,
        marks: marks,
    });
    console.log("data", data);

    return data;
};