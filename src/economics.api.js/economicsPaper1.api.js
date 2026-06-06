import api from "../api/axios.api.js";

// 🔥 NOW USING FORMDATA (NO BASE64)
export const economicsPaper1Request = async ({ query, image }) => {
  const formData = new FormData();

  if (query?.trim()) {
    formData.append("query", query.trim());
  }

  if (image) {
    formData.append("image", {
      uri: image,
      name: "mcq.jpg",
      type: "image/jpeg",
    });
  }

  const res = await api.post(
    "/economics/economics_paper_one",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};