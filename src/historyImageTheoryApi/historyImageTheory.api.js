import api from "../api/axios.api";

export const historyImageTheory = async (payload) => {
  try {
    const { question, marks, imageUri } = payload;

    const formData = new FormData();

    // 🔥 IMPORTANT: backend expects "query"
    formData.append("query", question ?? "Explain this image");

    formData.append("marks", String(marks ?? 3));

    formData.append("image", {
      uri: imageUri,
      name: "history-source.jpg",
      type: "image/jpeg",
    });

    const response = await api.post(
      "/history-sources/analyze-image-question",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("API ERROR:", error?.response?.data || error.message);
    throw error;
  }
};