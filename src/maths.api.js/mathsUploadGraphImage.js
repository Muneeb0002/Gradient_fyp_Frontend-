import api from "../api/axios.api.js";

/**
 * Image upload karke graph analysis ka data fetch karne ka function
 * @param {Object} fileObject - { uri: string, name: string, type: string }
 */
export const uploadGraphImage = async (fileObject) => {
  if (!fileObject || !fileObject.uri) {
    throw new Error("Koi image select nahi ki gayi!");
  }

  const formData = new FormData();

  // Multi-part form data format banana mandatory hai image upload ke liye
  formData.append("image", {
    uri: fileObject.uri,
    name: fileObject.name || "graph_image.jpg",
    type: fileObject.type || "image/jpeg",
  });

  const response = await api.post("/maths_numerical/graph_analysis", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};